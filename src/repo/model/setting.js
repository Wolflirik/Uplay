import { Model } from 'pinia-orm'

export default class Setting extends Model {
    static entity = 'setting-table'

    static primaryKey = ['key']

    static fields() {
        return {
            key: this.uid(),
            value: this.attr(null).notNullable(),
        }
    }
}
