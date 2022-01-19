import { Database } from 'arangojs';
import { Config } from 'arangojs/connection';
import {
  IClassDecoratorOptionsDefault,
  IRule,
} from '../interfaces/class-options.interface';
import {
  ARANGO_COLLECTION,
  ARANGO_PROPERTIES,
} from '../type-arangodb.constant';

export const clientFactory = async ({
  options,
  collections,
}: {
  options?: Config;
  collections: Function[];
}) => {
  const db = new Database(options);

  for (const collection of collections) {
    const [classMetadata]: IClassDecoratorOptionsDefault[] =
      Reflect.getMetadata(ARANGO_COLLECTION, collection.prototype);

    const { name, type, waitForSync, schema } = classMetadata;

    const [propertyMetadata]: IRule[] = Reflect.getMetadata(
      ARANGO_PROPERTIES,
      collection.prototype,
    );

    const rule: IRule = {
      properties: propertyMetadata.properties,
      additionalProperties: schema.rule.additionalProperties,
      required: propertyMetadata.required,
    };

    if (type === 'document') {
      await db.createCollection(name, {
        waitForSync,
        schema: { ...schema, rule },
      });
    }

    if (type === 'edge')
      await db.createEdgeCollection(name, {
        waitForSync,
        schema: { ...schema, rule },
      });
  }

  return db;
};
