
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
  5: string ImportDateTime,
  6: map<string, string> Metadata,
  7: string DocumentContent
}

const string STATUS_UNKNOWN = "UNKNOWN" // unknown
const string STATUS_NOT_FOUND = "NOT_FOUND" // not imported yet
const string STATUS_IMPORTED = "IMPORTED" // document imported
const string STATUS_READY = "READY" // document parsed

struct ArchiveDailyIndex {
  // metadata fields
  1: string ArticleSourceId,
  2: string ArchiveDailyIndexId,
  3: string LocalDate,
  4: string Status,
  5: string SourceUrl,
  6: map<string, string> Metadata,
  7: string Content
}

struct GetArchiveDailyIndexRequest {
  1: string ArticleSourceId,
  2: string ArchiveDailyIndexId
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
}

struct ImportDocumentResult {
  1: string Status,
  2: ImportedDocument ImportedDocument,
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
  ImportDocumentResult ImportDocument(1: GenericDocumentRequest request) throws (
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
  ArchiveDailyIndex GetArchiveDailyIndex(1: required GetArchiveDailyIndexRequest request) throws (
    1: ValidationError validationError,
  ),

  /**
   * Get imported document
   **/
  ImportDocumentResult GetImportedDocument(1: required GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  )

  /**
   * Parse imported archive daily index
   **/
  ArchiveDailyIndex ParseArchiveDailyIndex(1: required GenericDocumentRequest request) throws (
    1: ValidationError validationError,
  )
}
