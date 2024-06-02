import { Model } from 'pinia-orm'

export default class Artist extends Model {
    static entity = 'artist-table'

    static fields() {
        return {
            id: this.uid(),
            name: this.string(null).notNullable(),
            addedAt: this.number(Date.now()),
        }
    }
}
