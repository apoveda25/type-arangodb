# Type ArangoDB User Guide

## Commands

 This library is under construction, i hope to add more features soon, such as handling `one-to-one`, `one-to-many`, `many-to-one` and `many-to-many` relationships, using the graph-oriented model of [ArangoDB]( https://www.arangodb.com/docs/stable/aql/graphs.html).

 Type ArangoDB uses ArangoJS underneath, so it inherits all support and features from it.

Install TypeArangoDB:

```bash
npm install type-arangodb
```

```bash
yarn add type-arangodb
```

## Use Type ArangoDB

```typescript
import { clientFactory, Collection, Schema, Indexes, Field } from 'type-arangodb';

@Collection()
@Schema('moderate')
@Indexes({
    name: 'propertyTest1',
    fields: ['propertyTest1'],
    unique: true,
    type: 'persistent',
})
class CollectionTest {
    @Field('string')
    propertyTest1?: string;

    @Field({ type: 'number', requiredField: true })
    propertyTest2?: string;
}

// clientFactory will create the collections if they don't exist and attach the schema and indexes to each collection. 
const client = await clientFactory({
    options: {
        url: 'http://root:secret123@localhost:8529',
        databaseName: 'db-name',
    },
    collections: [CollectionTest],
});
```
