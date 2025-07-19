import cron from 'node-cron';
import { permanentlyDeleteUsers } from '../data-access/user.db.js';

export function startCleanupJob() {
    cron.schedule('*/30 * * * * *', async () => {
        console.log('[Cron Job] Running cleanup job...');
        const deleted = await permanentlyDeleteUsers();
        if (deleted?.length) {
            console.log(`[Cron Job] Deleted ${deleted.length} user(s).`);
        }
    });
}
