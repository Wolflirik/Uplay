import { Model } from 'pinia-orm'

export default class Image extends Model {
    static entity = 'image-table'

    static fields() {
        return {
            id: this.uid(),
            image: this.string(null).notNullable(),
        }
    }
}
