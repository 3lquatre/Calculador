import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('tec9')
        .setDescription('Calculate tec9 kit prices')
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
                .setName('drum_smg')
                .setDescription('Include drum smg?')
                .setRequired(true)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const quantity = interaction.options.getInteger('quantity');
        const hasMaterial = interaction.options.getBoolean('material');
        const hasSuppressor = interaction.options.getBoolean('suppressor');
        const hasDrumSmg = interaction.options.getBoolean('drum_smg');

        const prices = {
            base_with_material: 0,
            base_without_material: 0,
            suppressor_with_material: 2750,
            suppressor_without_material: 4500,
            drum_smg_with_material: 5500,
            drum_smg_without_material: 6500
        };

        const basePrice = hasMaterial ? prices.base_with_material : prices.base_without_material;
        const suppressorPrice = hasSuppressor ? (hasMaterial ? prices.suppressor_with_material : prices.suppressor_without_material) : 0;
        const drumSmgPrice = hasDrumSmg ? (hasMaterial ? prices.drum_smg_with_material : prices.drum_smg_without_material) : 0;
        const accessoryPrice = suppressorPrice + drumSmgPrice;
        const kitPrice = basePrice + accessoryPrice;
        const totalPrice = quantity * kitPrice;

        const accessories = [];
        accessories.push(hasMaterial ? '✓ Material' : '✗ No Material');
        if (hasSuppressor) accessories.push('✓ Suppressor');
        if (hasDrumSmg) accessories.push('✓ Drum SMG');

        const embed = createEmbed({
            title: '🔫 Tec9 Kit Price',
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
    }, { command: 'tec9' })
};
