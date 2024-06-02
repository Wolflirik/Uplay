import { Model } from 'pinia-orm'

export default class Track2artist extends Model {
    static entity = 'track2artist-table'

    static primaryKey = ['trackId', 'artistId']

    static fields() {
        return {
            trackId: this.string(null).notNullable(),
            artistId: this.string(null).notNullable(),
        }
    }
}
