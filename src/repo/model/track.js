import { Model } from 'pinia-orm'

export default class Track extends Model {
    static entity = 'track-table'

    static fields() {
        return {
            id: this.uid(),
            albumId: this.string(null).notNullable(),
            imageId: this.string(null).notNullable(),
            name: this.string(null).notNullable(),
            year: this.string(''),
            fileType: this.string(null).notNullable(),
            fileHandle: this.attr(null).notNullable(),
            duration: this.number(null).notNullable(),
            playCount: this.number(0),
            playedAt: this.number(null),
            addedAt: this.number(Date.now()),
        }
    }
}
