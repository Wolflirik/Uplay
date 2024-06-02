import { Model } from 'pinia-orm'

export default class Album extends Model {
    static entity = 'album-table'

    static fields() {
        return {
            id: this.uid(),
            title: this.string(null).notNullable(),
            addedAt: this.number(Date.now()),
        }
    }
}
