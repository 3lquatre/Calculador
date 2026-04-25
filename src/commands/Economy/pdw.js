import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pdw')
        .setDescription('Calculate PDW kit prices')
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
                .setName('drum_smg')
                .setDescription('Include drum smg?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('grip')
                .setDescription('Include grip?')
                .setRequired(true)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const quantity = interaction.options.getInteger('quantity');
        const hasMaterial = interaction.options.getBoolean('material');
        const hasDrumSmg = interaction.options.getBoolean('drum_smg');
        const hasGrip = interaction.options.getBoolean('grip');

        const prices = {
            base_with_material: 0,
            base_without_material: 0,
            drum_smg_with_material: 5500,
            drum_smg_without_material: 6500,
            grip_with_material: 5500,
            grip_without_material: 7500
        };

        const basePrice = hasMaterial ? prices.base_with_material : prices.base_without_material;
        const drumSmgPrice = hasDrumSmg ? (hasMaterial ? prices.drum_smg_with_material : prices.drum_smg_without_material) : 0;
        const gripPrice = hasGrip ? (hasMaterial ? prices.grip_with_material : prices.grip_without_material) : 0;
        const accessoryPrice = drumSmgPrice + gripPrice;
        const kitPrice = basePrice + accessoryPrice;
        const totalPrice = quantity * kitPrice;

        const accessories = [];
        accessories.push(hasMaterial ? '✓ Material' : '✗ No Material');
        if (hasDrumSmg) accessories.push('✓ Drum SMG');
        if (hasGrip) accessories.push('✓ Grip');

        const embed = createEmbed({
            title: '🔫 PDW Kit Price',
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
    }, { command: 'pdw' })
};
