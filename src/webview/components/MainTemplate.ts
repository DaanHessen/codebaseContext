import { getExclusionsTab } from './ExclusionsTab';
import { getSettingsTab } from './SettingsTab';
import { getProgressBar } from './ProgressBar';
import { getNotification } from './Notification';
import { getGenerateButton } from './GenerateButton';

export function getMainTemplate(): string {
    return `
        <div class="container">
            <div class="tabs">
                <button class="tab active" data-tab="exclusions">Exclusions</button>
                <button class="tab" data-tab="settings">Settings</button>
            </div>

            ${getExclusionsTab()}
            ${getSettingsTab()}
            ${getProgressBar()}
            ${getNotification()}
            ${getGenerateButton()}
        </div>
    `;
} 