import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('glock')
        .setDescription('Calculate glock kit prices')
        .addIntegerOption(option =>
            option
                .setName('quantity')
                .setDescription('Number of kits')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .addBooleanOption(option =>
            option
                .setName('material')
                .setDescription('Include material?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('suppressor')
                .setDescription('Include suppressor?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('ext_pistol_clip')
                .setDescription('Include extended pistol clip?')
                .setRequired(true)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const quantity = interaction.options.getInteger('quantity');
        const hasMaterial = interaction.options.getBoolean('material');
        const hasSuppressor = interaction.options.getBoolean('suppressor');
        const hasExtClip = interaction.options.getBoolean('ext_pistol_clip');

        const prices = {
            base_with_material: 0,
            base_without_material: 0,
            suppressor_with_material: 2750,
            suppressor_without_material: 4500,
            ext_pistol_clip_with_material: 2750,
            ext_pistol_clip_without_material: 4000
        };

        const basePrice = hasMaterial ? prices.base_with_material : prices.base_without_material;
        const suppressorPrice = hasSuppressor ? (hasMaterial ? prices.suppressor_with_material : prices.suppressor_without_material) : 0;
        const clipPrice = hasExtClip ? (hasMaterial ? prices.ext_pistol_clip_with_material : prices.ext_pistol_clip_without_material) : 0;
        const accessoryPrice = suppressorPrice + clipPrice;
        const kitPrice = basePrice + accessoryPrice;
        const totalPrice = quantity * kitPrice;

        const accessories = [];
        accessories.push(hasMaterial ? '✓ Material' : '✗ No Material');
        if (hasSuppressor) accessories.push('✓ Suppressor');
        if (hasExtClip) accessories.push('✓ Ext. Pistol Clip');

        const embed = createEmbed({
            title: '🔫 Glock Kit Price',
            color: 'primary',
        })
            .addFields(
                { name: 'Quantity', value: `${quantity}`, inline: true },
                { name: 'Base Price', value: `$${basePrice.toLocaleString()}`, inline: true },
                { name: 'Accessories', value: accessories.join('\n'), inline: true },
                { name: 'Kit Total', value: `$${kitPrice.toLocaleString()}`, inline: true },
                { name: 'Grand Total', value: `$${totalPrice.toLocaleString()}`, inline: true }
            );

        await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    }, { command: 'glock' })
};
