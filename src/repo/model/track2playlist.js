import { Model } from 'pinia-orm'

export default class Track2playlist extends Model {
    static entity = 'track2playlist-table'

    static primaryKey = ['trackId', 'playlistId']

    static fields() {
        return {
            trackId: this.string(null).notNullable(),
            playlistId: this.string(null).notNullable(),
        }
    }
}
