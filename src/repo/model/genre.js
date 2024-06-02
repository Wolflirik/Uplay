import { Model } from 'pinia-orm'

export default class Genre extends Model {
    static entity = 'genre-table'

    static fields() {
        return {
            id: this.uid(),
            name: this.string(null).notNullable(),
            addedAt: this.number(Date.now()),
        }
    }
}
