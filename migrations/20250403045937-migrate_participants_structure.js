const { ObjectId } = require('mongodb');

module.exports = {
    /**
     * @param db {import('mongodb').Db}
     * @param client {import('mongodb').MongoClient}
     * @returns {Promise<void>}
     */
    async up(db) {
        const events = await db.collection('events').find().toArray();

        for (const event of events) {
            if (event.participants.length > 0 && typeof event.participants[0] === 'object') {
                console.log('Skipping event ${event._id}, already migrated.');
                continue;
            }

            const updatedParticipants = event.participants
                .filter((userId) => ObjectId.isValid(userId))
                .map((userId) => ({
                    user: new ObjectId(userId),
                    status: 'accepted',
                }));

            await db.collection('events').updateOne({ _id: event._id }, { $set: { participants: updatedParticipants } });
            console.log(`Migrated event ${event._id}`);
        }
        // TODO write your migration here.
        // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
        // Example:
        // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    },

    /**
     * @param db {import('mongodb').Db}
     * @param client {import('mongodb').MongoClient}
     * @returns {Promise<void>}
     */
    async down(db) {
        const events = await db.collection('events').find().toArray();

        for (const event of events) {
            if (!event.participants || !Array.isArray(event.participants)) continue;

            const originalParticipants = event.participants.map((p) => (p.user ? new ObjectId(p.user) : null)).filter((userId) => userId !== null); // null 값 제거

            await db.collection('events').updateOne({ _id: event._id }, { $set: { participants: originalParticipants } });

            console.log(`🔄 Reverted event ${event._id}`);
        }
    },
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
};
