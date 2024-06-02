import { Model } from 'pinia-orm'

export default class Playlist extends Model {
    static entity = 'playlist-table'

    static fields() {
        return {
            id: this.uid(),
            emoji: this.string(null).notNullable(),
            name: this.string(null).notNullable(),
            lock: this.boolean(false).notNullable(),
            addedAt: this.number(Date.now()),
        }
    }
}
