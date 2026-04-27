import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('materiais')
        .setDescription('Calculate materials needed for items')
        .addIntegerOption(option =>
            option
                .setName('macro_scope')
                .setDescription('Macro Scope quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('tactical_suppressor')
                .setDescription('Tactical Suppressor quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('ext_clip')
                .setDescription('Extended Clip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('grip')
                .setDescription('Grip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('barrel')
                .setDescription('Barrel quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('lantern')
                .setDescription('Lantern quantity')
                .setRequired(false)
                .setMinValue(0)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const macroScopeQty = interaction.options.getInteger('macro_scope') || 0;
        const tacticalSuppressorQty = interaction.options.getInteger('tactical_suppressor') || 0;
        const extClipQty = interaction.options.getInteger('ext_clip') || 0;
        const gripQty = interaction.options.getInteger('grip') || 0;
        const barrelQty = interaction.options.getInteger('barrel') || 0;
        const lanternQty = interaction.options.getInteger('lantern') || 0;

        // Materials per item: { plastic, carbon }
        const materials = {
            macro_scope: { plastic: 40, carbon: 35 },
            tactical_suppressor: { plastic: 0, carbon: 0 }, // Add values
            ext_clip: { plastic: 0, carbon: 0 }, // Add values
            grip: { plastic: 0, carbon: 0 }, // Add values
            barrel: { plastic: 0, carbon: 0 }, // Add values
            lantern: { plastic: 0, carbon: 0 } // Add values
        };

        let totalPlastic = 0;
        let totalCarbon = 0;
        const breakdown = [];

        if (macroScopeQty > 0) {
            const plastic = macroScopeQty * materials.macro_scope.plastic;
            const carbon = macroScopeQty * materials.macro_scope.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Macro Scope: ${macroScopeQty} x (${materials.macro_scope.plastic} plástico + ${materials.macro_scope.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        if (tacticalSuppressorQty > 0) {
            const plastic = tacticalSuppressorQty * materials.tactical_suppressor.plastic;
            const carbon = tacticalSuppressorQty * materials.tactical_suppressor.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Tactical Suppressor: ${tacticalSuppressorQty} x (${materials.tactical_suppressor.plastic} plástico + ${materials.tactical_suppressor.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        if (extClipQty > 0) {
            const plastic = extClipQty * materials.ext_clip.plastic;
            const carbon = extClipQty * materials.ext_clip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Ext. Clip: ${extClipQty} x (${materials.ext_clip.plastic} plástico + ${materials.ext_clip.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        if (gripQty > 0) {
            const plastic = gripQty * materials.grip.plastic;
            const carbon = gripQty * materials.grip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Grip: ${gripQty} x (${materials.grip.plastic} plástico + ${materials.grip.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        if (barrelQty > 0) {
            const plastic = barrelQty * materials.barrel.plastic;
            const carbon = barrelQty * materials.barrel.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Barrel: ${barrelQty} x (${materials.barrel.plastic} plástico + ${materials.barrel.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        if (lanternQty > 0) {
            const plastic = lanternQty * materials.lantern.plastic;
            const carbon = lanternQty * materials.lantern.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Lantern: ${lanternQty} x (${materials.lantern.plastic} plástico + ${materials.lantern.carbon} carbono) = ${plastic} plástico + ${carbon} carbono`);
        }

        const embed = createEmbed({
            title: '⚙️ Materiais Necessários',
            color: 'primary',
        })
            .addFields(
                { name: 'Breakdown', value: breakdown.length > 0 ? breakdown.join('\n') : 'Nenhum item', inline: false },
                { name: 'Total Plástico', value: `${totalPlastic}`, inline: true },
                { name: 'Total Carbono', value: `${totalCarbon}`, inline: true }
            );

        const message = await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });

        // Delete message after 30 minutes (1800000 milliseconds)
        setTimeout(() => {
            message?.delete().catch(() => {});
        }, 1800000);
    }, { command: 'materiais' })
};
