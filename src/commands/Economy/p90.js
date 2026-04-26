import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling, createError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('p90')
        .setDescription('Calculate P90 kit prices')
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
                .setName('tactical_suppressor')
                .setDescription('Include tactical suppressor?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('ext_smg_clip')
                .setDescription('Include extended smg clip?')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName('macro_scope')
                .setDescription('Include macro scope?')
                .setRequired(true)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const quantity = interaction.options.getInteger('quantity');
        const hasMaterial = interaction.options.getBoolean('material');
        const hasTacticalSuppressor = interaction.options.getBoolean('tactical_suppressor');
        const hasExtSmgClip = interaction.options.getBoolean('ext_smg_clip');
        const hasMacroScope = interaction.options.getBoolean('macro_scope');

        const prices = {
            base_with_material: 0,
            base_without_material: 0,
            tactical_suppressor_with_material: 4500,
            tactical_suppressor_without_material: 6500,
            ext_smg_clip_with_material: 3500,
            ext_smg_clip_without_material: 5500,
            macro_scope_with_material: 2500,
            macro_scope_without_material: 4000
        };

        const basePrice = hasMaterial ? prices.base_with_material : prices.base_without_material;
        const suppressorPrice = hasTacticalSuppressor ? (hasMaterial ? prices.tactical_suppressor_with_material : prices.tactical_suppressor_without_material) : 0;
        const clipPrice = hasExtSmgClip ? (hasMaterial ? prices.ext_smg_clip_with_material : prices.ext_smg_clip_without_material) : 0;
        const scopePrice = hasMacroScope ? (hasMaterial ? prices.macro_scope_with_material : prices.macro_scope_without_material) : 0;
        const accessoryPrice = suppressorPrice + clipPrice + scopePrice;
        const kitPrice = basePrice + accessoryPrice;
        const totalPrice = quantity * kitPrice;

        const accessories = [];
        accessories.push(hasMaterial ? '✓ Material' : '✗ No Material');
        if (hasTacticalSuppressor) accessories.push('✓ Tactical Suppressor');
        if (hasExtSmgClip) accessories.push('✓ Ext. SMG Clip');
        if (hasMacroScope) accessories.push('✓ Macro Scope');

        const embed = createEmbed({
            title: '🔫 P90 Kit Price',
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
    }, { command: 'p90' })
};
