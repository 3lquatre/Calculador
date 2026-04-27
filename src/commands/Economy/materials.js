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
                .setName('tactical_flashlight')
                .setDescription('Tactical Flashlight quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('suppressor')
                .setDescription('Suppressor quantity')
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
                .setName('grip')
                .setDescription('Grip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('heavy_barrel')
                .setDescription('Heavy Barrel quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('ext_pistol_clip')
                .setDescription('Ext. Pistol Clip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('ext_smg_clip')
                .setDescription('Ext. SMG Clip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('ext_rifle_clip')
                .setDescription('Ext. Rifle Clip quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('smg_drum')
                .setDescription('SMG Drum quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('rifle_drum')
                .setDescription('Rifle Drum quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('macro_scope')
                .setDescription('Macro Scope quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('medium_scope')
                .setDescription('Medium Scope quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('princess_robot')
                .setDescription('Princess Robot Boneco quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('space_monkey')
                .setDescription('Space Monkey Boneco quantity')
                .setRequired(false)
                .setMinValue(0)
        )
        .addIntegerOption(option =>
            option
                .setName('impotent_rage')
                .setDescription('Impotent Rage Boneco quantity')
                .setRequired(false)
                .setMinValue(0)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        const tacticalFlashlightQty = interaction.options.getInteger('tactical_flashlight') || 0;
        const suppressorQty = interaction.options.getInteger('suppressor') || 0;
        const tacticalSuppressorQty = interaction.options.getInteger('tactical_suppressor') || 0;
        const gripQty = interaction.options.getInteger('grip') || 0;
        const heavyBarrelQty = interaction.options.getInteger('heavy_barrel') || 0;
        const extPistolClipQty = interaction.options.getInteger('ext_pistol_clip') || 0;
        const extSmgClipQty = interaction.options.getInteger('ext_smg_clip') || 0;
        const extRifleClipQty = interaction.options.getInteger('ext_rifle_clip') || 0;
        const smgDrumQty = interaction.options.getInteger('smg_drum') || 0;
        const rifleDrumQty = interaction.options.getInteger('rifle_drum') || 0;
        const macroScopeQty = interaction.options.getInteger('macro_scope') || 0;
        const mediumScopeQty = interaction.options.getInteger('medium_scope') || 0;
        const princessRobotQty = interaction.options.getInteger('princess_robot') || 0;
        const spaceMonkeyQty = interaction.options.getInteger('space_monkey') || 0;
        const impotentRageQty = interaction.options.getInteger('impotent_rage') || 0;

        // Materials per item: { plastic, carbon }
        const materials = {
            tactical_flashlight: { plastic: 30, carbon: 25 },
            suppressor: { plastic: 30, carbon: 25 },
            tactical_suppressor: { plastic: 45, carbon: 40 },
            grip: { plastic: 45, carbon: 50 },
            heavy_barrel: { plastic: 45, carbon: 40 },
            ext_pistol_clip: { plastic: 30, carbon: 25 },
            ext_smg_clip: { plastic: 35, carbon: 25 },
            ext_rifle_clip: { plastic: 45, carbon: 40 },
            smg_drum: { plastic: 45, carbon: 40 },
            rifle_drum: { plastic: 45, carbon: 40 },
            macro_scope: { plastic: 25, carbon: 20 },
            medium_scope: { plastic: 40, carbon: 35 },
            princess_robot: { plastic: 5, carbon: 0 },
            space_monkey: { plastic: 5, carbon: 0 },
            impotent_rage: { plastic: 5, carbon: 0 }
        };

        let totalPlastic = 0;
        let totalCarbon = 0;
        const breakdown = [];

        if (tacticalFlashlightQty > 0) {
            const plastic = tacticalFlashlightQty * materials.tactical_flashlight.plastic;
            const carbon = tacticalFlashlightQty * materials.tactical_flashlight.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Tactical Flashlight: ${tacticalFlashlightQty} x (${materials.tactical_flashlight.plastic}p + ${materials.tactical_flashlight.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (suppressorQty > 0) {
            const plastic = suppressorQty * materials.suppressor.plastic;
            const carbon = suppressorQty * materials.suppressor.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Suppressor: ${suppressorQty} x (${materials.suppressor.plastic}p + ${materials.suppressor.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (tacticalSuppressorQty > 0) {
            const plastic = tacticalSuppressorQty * materials.tactical_suppressor.plastic;
            const carbon = tacticalSuppressorQty * materials.tactical_suppressor.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Tactical Suppressor: ${tacticalSuppressorQty} x (${materials.tactical_suppressor.plastic}p + ${materials.tactical_suppressor.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (gripQty > 0) {
            const plastic = gripQty * materials.grip.plastic;
            const carbon = gripQty * materials.grip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Grip: ${gripQty} x (${materials.grip.plastic}p + ${materials.grip.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (heavyBarrelQty > 0) {
            const plastic = heavyBarrelQty * materials.heavy_barrel.plastic;
            const carbon = heavyBarrelQty * materials.heavy_barrel.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Heavy Barrel: ${heavyBarrelQty} x (${materials.heavy_barrel.plastic}p + ${materials.heavy_barrel.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (extPistolClipQty > 0) {
            const plastic = extPistolClipQty * materials.ext_pistol_clip.plastic;
            const carbon = extPistolClipQty * materials.ext_pistol_clip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Ext. Pistol Clip: ${extPistolClipQty} x (${materials.ext_pistol_clip.plastic}p + ${materials.ext_pistol_clip.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (extSmgClipQty > 0) {
            const plastic = extSmgClipQty * materials.ext_smg_clip.plastic;
            const carbon = extSmgClipQty * materials.ext_smg_clip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Ext. SMG Clip: ${extSmgClipQty} x (${materials.ext_smg_clip.plastic}p + ${materials.ext_smg_clip.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (extRifleClipQty > 0) {
            const plastic = extRifleClipQty * materials.ext_rifle_clip.plastic;
            const carbon = extRifleClipQty * materials.ext_rifle_clip.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Ext. Rifle Clip: ${extRifleClipQty} x (${materials.ext_rifle_clip.plastic}p + ${materials.ext_rifle_clip.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (smgDrumQty > 0) {
            const plastic = smgDrumQty * materials.smg_drum.plastic;
            const carbon = smgDrumQty * materials.smg_drum.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`SMG Drum: ${smgDrumQty} x (${materials.smg_drum.plastic}p + ${materials.smg_drum.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (rifleDrumQty > 0) {
            const plastic = rifleDrumQty * materials.rifle_drum.plastic;
            const carbon = rifleDrumQty * materials.rifle_drum.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Rifle Drum: ${rifleDrumQty} x (${materials.rifle_drum.plastic}p + ${materials.rifle_drum.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (macroScopeQty > 0) {
            const plastic = macroScopeQty * materials.macro_scope.plastic;
            const carbon = macroScopeQty * materials.macro_scope.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Macro Scope: ${macroScopeQty} x (${materials.macro_scope.plastic}p + ${materials.macro_scope.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (mediumScopeQty > 0) {
            const plastic = mediumScopeQty * materials.medium_scope.plastic;
            const carbon = mediumScopeQty * materials.medium_scope.carbon;
            totalPlastic += plastic;
            totalCarbon += carbon;
            breakdown.push(`Medium Scope: ${mediumScopeQty} x (${materials.medium_scope.plastic}p + ${materials.medium_scope.carbon}c) = ${plastic}p + ${carbon}c`);
        }

        if (princessRobotQty > 0) {
            const plastic = princessRobotQty * materials.princess_robot.plastic;
            totalPlastic += plastic;
            breakdown.push(`Princess Robot: ${princessRobotQty} x ${materials.princess_robot.plastic}p = ${plastic}p`);
        }

        if (spaceMonkeyQty > 0) {
            const plastic = spaceMonkeyQty * materials.space_monkey.plastic;
            totalPlastic += plastic;
            breakdown.push(`Space Monkey: ${spaceMonkeyQty} x ${materials.space_monkey.plastic}p = ${plastic}p`);
        }

        if (impotentRageQty > 0) {
            const plastic = impotentRageQty * materials.impotent_rage.plastic;
            totalPlastic += plastic;
            breakdown.push(`Impotent Rage: ${impotentRageQty} x ${materials.impotent_rage.plastic}p = ${plastic}p`);
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
