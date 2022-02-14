import {
  EnsureFulltextIndexOptions,
  EnsureGeoIndexOptions,
  EnsurePersistentIndexOptions,
  EnsureTtlIndexOptions,
} from 'arangojs/indexes';

export declare type ArangoIndexDecoratorOption =
  | EnsurePersistentIndexOptions
  | EnsureTtlIndexOptions
  | EnsureFulltextIndexOptions
  | EnsureGeoIndexOptions;

export declare type CreatePersistentIndexOptions =
  EnsurePersistentIndexOptions & { name: string };

export declare type CreateTtlIndexOptions = EnsureTtlIndexOptions & {
  name: string;
};

export declare type CreateFulltextIndexOptions = EnsureFulltextIndexOptions & {
  name: string;
};

export declare type CreateGeoIndexOptions = EnsureGeoIndexOptions & {
  name: string;
};

export declare type ArangoCreateIndexOption =
  | CreatePersistentIndexOptions
  | CreateTtlIndexOptions
  | CreateFulltextIndexOptions
  | CreateGeoIndexOptions;
