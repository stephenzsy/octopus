
namespace js Kraken

exception ValidationError {
  1: string ErrorCode,
  2: string Message
}

struct ArticleSource {
  1: string Id,
  2: string Name,
  3: string Url
}

const string TYPE_DAILY_INDEX = "ARCHIVE_DAILY_INDEX"
const string TYPE_ARTICLE = "ARTICLE"

struct ImportedDocument {
  1: string ArticleSourceId,
  2: string Type,
  3: string Id,
  4: string SourceUrl,
  5: string ImportTimestamp,
  6: map<string, string> Metadata,
  7: string DocumentContent
  8: string Status
}

const string STATUS_UNKNOWN = "UNKNOWN" // unknown
const string STATUS_NOT_FOUND = "NOT_FOUND" // not imported yet
const string STATUS_IMPORTED = "IMPORTED" // document imported
const string STATUS_READY = "READY" // document parsed

struct ArchiveDailyIndexEntry {
  1: string ArticleId,
  2: string Url
  3: string Name
}

struct ArchiveDailyIndex {
  1: string ArticleSourceId,
  2: string ArchiveDailyIndexId,
  3: string LocalDate,
  4: string Status,
  5: string SourceUrl,
  6: map<string, string> Metadata,
  7: list<ArchiveDailyIndexEntry> ArticleEntries;
}

struct ListArchiveDailyIndicesRequest {
  1: required string ArticleSourceId,
  2: string LatestLocalDate, // ISO 8601 formatted
  3: i32 Limit = 10, // limit on how many indices to fetch
}

struct GetArticleSourceRequest {
  1: required string ArticleSourceId
}

struct GenericDocumentRequest {
  1: required string ArticleSourceId,
  2: required string DocumentType,
  3: required string DocumentId,
  4: string ArchiveBucket // Import bucket for archiving and storing documents, especially for Articles. Usually it's the date in YYYY-MM-DD format
}

service KrakenService {
  void ping(),

  /**
   * List Article Sources
   */
  list<ArticleSource> ListArticleSources(),

  /**
   * Import external document into repository
   */
  ImportedDocument ImportDocument(1: GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  ),

  /**
   * Get Article Source By ID
   */
  ArticleSource GetArticleSource(1: GetArticleSourceRequest request) throws (
    1: ValidationError validationError,
  ),

  /**
   * List Archive Daily Indices
   **/
  list<ArchiveDailyIndex> ListArchiveDailyIndices(1: required ListArchiveDailyIndicesRequest request) throws (
    1: ValidationError validationError,
  ),

  /**
   * Get Archive Daily Index
   **/
  ArchiveDailyIndex GetArchiveDailyIndex(1: required GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  ),

  /**
   * Get imported document
   **/
  ImportedDocument GetImportedDocument(1: required GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  )

  /**
   * Parse imported archive daily index
   **/
  ArchiveDailyIndex ParseArchiveDailyIndex(1: required GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  )
}
