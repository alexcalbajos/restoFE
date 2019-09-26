export class MetaData {
    title?: string;
    titleTranslationParam?: any;
    description?: string;
    descriptionTranslationParam?: any;
    openGraph?: OpenGraph;
    canonicalUrl?: string;
}

export class OpenGraph {
    title?: string;
    titleTranslationParam?: any;
    url?: string;
    image?: string;
    description?: string;
    descriptionTranslationParam?: string;
}
