# Type ArangoDB User Guide

## Description

 This library is under construction, i hope to add more features soon, such as handling `one-to-one`, `one-to-many`, `many-to-one` and `many-to-many` relationships, using the graph-oriented model of [ArangoDB]( https://www.arangodb.com/docs/stable/aql/graphs.html).

 Type ArangoDB uses ArangoJS underneath, so it inherits all support and features from it.

Install TypeArangoDB:

```bash
npm install type-arangodb
```

```bash
yarn add type-arangodb
```

## Use `type-arangodb`

### Define collections

```typescript
import { Collection } from 'type-arangodb';
import { CollectionType } from 'arangojs';

// Document type collection declaration
@Collection()
class EntityTest {}

// Document type collection declaration with custom name
@Collection('EntityTestNameCustom')
class EntityTest {}

// Document declaration with explicit type document
@Collection({ type: CollectionType.DOCUMENT_COLLECTION })
class EntityTest {}

// Document declaration with explicit type edge
@Collection({ type: CollectionType.EDGE_COLLECTION })
class EntityTest {}
```

### Define indexes

```typescript
import { Collection, Indexes } from 'type-arangodb';

// Index in field 'name'
@Collection()
@Indexes({
  name: 'TestIndex',
  type: 'persistent',
  fields: ['name'],
  sparse: true,
  unique: true,
})
class EntityTest {
  _id: string;
  _key: string;
  name: string;
}

// Index compound in fields 'name' and 'username'
// Index in field 'email'
@Collection()
@Indexes(
  {
    name: 'TestIndex',
    type: 'persistent',
    fields: ['username', 'name'],
    sparse: true,
    unique: true,
  },
  {
    name: 'TestIndex',
    type: 'persistent',
    fields: ['email'],
    sparse: true,
    unique: true,
  },
)
class EntityTest {
  _id: string;
  _key: string;
  name: string;
  username: string;
  email: string;
}
```

### Define schema

```typescript
import { Collection, Schema } from 'type-arangodb';

// Schema with moderate level
@Collection()
@Schema('moderate')
class EntityTest {}

// Schema with level, error message and type additional properties
@Collection()
@Schema({
  level: 'moderate',
  message: 'Message example',
  additionalProperties: 'string',
})
class EntityTest {}
```

### Define property

```typescript
import { Collection, Property } from 'type-arangodb';

// Properties of type 'string' and 'number'
@Collection()
class EntityTest {
  _id: string;
  _key: string;

  @Property('string')
  propertyTest1: string;

  @Property('number')
  propertyTest2: number;
}

// Properties of type 'string' and 'number' with min and max values. Property 'propertyTest1' is required.
@Collection()
class EntityTest {
  _id: string;
  _key: string;

  @Property({
    type: 'string',
    minLength: 3,
    maxLength: 20,
    requiredField: true,
  })
  propertyTest1: string;

  @Property({ type: 'number', minimum: 0, maximun: 9 })
  propertyTest2: number;
}
```

### Create client

```typescript
import { ArangoClient } from 'type-arangodb';

// Create client
const client = new ArangoClient({
  url: 'http://root:secret123@localhost:8529',
  databaseName: 'db-name',
});

// Get the instance of 'Database' from 'arangojs'
const database = client.getDatabase();

// Create collections, schemas and indexes if they don't exist
await client.registerEntities([Entity1, Entity2, ..., EntityN]);

// Get a repository from an entity
const entity1Repository = client.getRepository<EntityTest>(EntityTest);
```

### Use repository

```typescript
import { ArangoClient } from 'type-arangodb';

// Create client
const client = new ArangoClient({
  url: 'http://root:secret123@localhost:8529',
  databaseName: 'db-name',
});

// Get a repository from an entity
class EntityTest {
  _id: string;
  _key: string;
  username: string;
  email: string;
  createdAt: number;
}
const entityTestRepository = client.getRepository<EntityTest>(EntityTest);

// Get the instance of collection 'DocumentCollection<T> & EdgeCollection<T>' from 'arangojs'
const collectionEntityTest = entityTestRepository.getCollection();

// Return a document
const document = await entityTestRepository.findOne({
  // Filter the search for documents.
  // If the 'filter' object is not defined, no filters are applied to the search.
  filters: {
    username: {
      equals: 'usernameTest',
    },
    email: {
      OR: [
        {
          endsWith: '@gmail.com',
        },
        {
          endsWith: '@hotmail.com',
        },
      ],
    },
    createdAt: {
      AND: [
        {
          lte: 1645307101225,
          gte: 1645307101225,
        },
      ],
    },
  },
  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    username: true,
    email: true,
  },
});

// Return documents
const documents = await entityTestRepository.findMany({
  // Filter the search for documents.
  // If the 'filter' object is not defined, no filters are applied to the search.
  filters: {
    username: {
      equals: 'usernameTest',
    },
    email: {
      OR: [
        {
          endsWith: '@gmail.com',
        },
        {
          endsWith: '@hotmail.com',
        },
      ],
    },
    createdAt: {
      AND: [
        {
          lte: 1645307101225,
          gte: 1645307101225,
        },
      ],
    },
  },
  // Field to sort and type of sort.
  // If the 'sort' object is not defined, results are not sorted.
  sort: {
    username: 'ASC',
    email: 'ASC',
    createdAt: 'DESC',
  }
  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    username: true,
    email: true,
  },
  // Number of documents to be returned. Default 10.
  count: 50,
  // Document number from which the count begins. Default 0.
  offset: 0
});

// Return number documents
const numberDocuments = await entityTestRepository.count({
  // Filter the search for documents.
  // If the 'filter' object is not defined, no filters are applied to the search.
  filters: {
    username: {
      equals: 'usernameTest',
    },
    email: {
      OR: [
        {
          endsWith: '@gmail.com',
        },
        {
          endsWith: '@hotmail.com',
        },
      ],
    },
    createdAt: {
      AND: [
        {
          lte: 1645307101225,
          gte: 1645307101225,
        },
      ],
    },
  },
});

// Return created document
const createdDocument = await entityTestRepository.createOne({
  // Data must be a plain entity object
  data: {
    _id: 'EntityTest/123456',
    _key: '123456',
    username: 'usernameTest',
    email: 'email@test.com',
    createdAt: Date.now(),
  },

  // It can also be
  // data: {
  //   username: 'usernameTest',
  //   email: 'email@test.com',
  //   createdAt: Date.now(),
  // },

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return created documents
const createdDocuments = await entityTestRepository.createMany({
  // Data must be a array of plain entity object
  data: [
    {
      _id: 'EntityTest/123456',
      _key: '123456',
      username: 'usernameTest',
      email: 'email@test.com',
      createdAt: Date.now(),
    }
  ],

  // It can also be
  // data: [
  //   {
  //     username: 'usernameTest',
  //     email: 'email@test.com',
  //     createdAt: Date.now(),
  //   }
  // ],

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});


// Return upserted document
const upsertedDocument = await entityTestRepository.createUpdateOne({
  // Data must be a plain entity object
  data: {
    _id: 'EntityTest/123456',
    _key: '123456',
    username: 'usernameTest',
    email: 'email@test.com',
    createdAt: Date.now(),
  },

  // It can also be
  // data: {
  //   username: 'usernameTest',
  //   email: 'email@test.com',
  //   createdAt: Date.now(),
  // },

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return upserted documents
const upsertedDocuments = await entityTestRepository.createUpdateMany({
  // Data must be a array of plain entity object
  data: [
    {
      _id: 'EntityTest/123456',
      _key: '123456',
      username: 'usernameTest',
      email: 'email@test.com',
      createdAt: Date.now(),
    }
  ],

  // It can also be
  // data: [
  //   {
  //     username: 'usernameTest',
  //     email: 'email@test.com',
  //     createdAt: Date.now(),
  //   }
  // ],

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return updated document
const updatedDocument = await entityTestRepository.updateOne({
  // Data must be a plain entity object
  data: {
    _id: 'EntityTest/123456',
    _key: '123456',
    username: 'usernameTest',
    email: 'email@test.com',
    createdAt: Date.now(),
  },

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return updated documents
const updatedDocuments = await entityTestRepository.updateMany({
  // Data must be a array of plain entity object
  data: [
    {
      _id: 'EntityTest/123456',
      _key: '123456',
      username: 'usernameTest',
      email: 'email@test.com',
    }
  ],

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return replaced document
const replacedDocument = await entityTestRepository.replaceOne({
  // Data must be a plain entity object
  data: {
    _id: 'EntityTest/123456',
    _key: '123456',
    username: 'usernameTest',
    email: 'email@test.com',
    createdAt: Date.now(),
  },

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return replaced documents
const replacedDocuments = await entityTestRepository.replaceMany({
  // Data must be a array of plain entity object
  data: [
    {
      _id: 'EntityTest/123456',
      _key: '123456',
      username: 'usernameTest',
      email: 'email@test.com',
      createdAt: Date.now(),
    }
  ],

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return removed document
const removedDocument = await entityTestRepository.removeOne({
  // Data must be a plain entity object
  data: {
    _id: 'EntityTest/123456',
  },

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});

// Return removed documents
const removedDocuments = await entityTestRepository.removeMany({
  // Data must be a array of plain entity object
  data: [
    {
      _key: '123456',
    }
  ],

  // Select the document fields.
  // If the 'select' object is not defined, all fields of the document are returned.
  select: {
    _id: true,
    username: true,
    email: true,
  }
});
```
