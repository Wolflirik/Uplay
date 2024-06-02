import { Model } from 'pinia-orm'

export default class Track2genre extends Model {
    static entity = 'track2genre-table'

    static primaryKey = ['trackId', 'genreId']

    static fields() {
        return {
            trackId: this.string(null).notNullable(),
            genreId: this.string(null).notNullable(),
        }
    }
}
