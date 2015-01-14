//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//


if (typeof Kraken === 'undefined') {
  Kraken = {};
}
Kraken.ValidationError = function(args) {
  this.ErrorCode = null;
  this.Message = null;
  if (args) {
    if (args.ErrorCode !== undefined) {
      this.ErrorCode = args.ErrorCode;
    }
    if (args.Message !== undefined) {
      this.Message = args.Message;
    }
  }
};
Thrift.inherits(Kraken.ValidationError, Thrift.TException);
Kraken.ValidationError.prototype.name = 'ValidationError';
Kraken.ValidationError.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ErrorCode = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.Message = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ValidationError.prototype.write = function(output) {
  output.writeStructBegin('ValidationError');
  if (this.ErrorCode !== null && this.ErrorCode !== undefined) {
    output.writeFieldBegin('ErrorCode', Thrift.Type.STRING, 1);
    output.writeString(this.ErrorCode);
    output.writeFieldEnd();
  }
  if (this.Message !== null && this.Message !== undefined) {
    output.writeFieldBegin('Message', Thrift.Type.STRING, 2);
    output.writeString(this.Message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ArticleSource = function(args) {
  this.Id = null;
  this.Name = null;
  this.Url = null;
  if (args) {
    if (args.Id !== undefined) {
      this.Id = args.Id;
    }
    if (args.Name !== undefined) {
      this.Name = args.Name;
    }
    if (args.Url !== undefined) {
      this.Url = args.Url;
    }
  }
};
Kraken.ArticleSource.prototype = {};
Kraken.ArticleSource.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.Id = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.Name = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.Url = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ArticleSource.prototype.write = function(output) {
  output.writeStructBegin('ArticleSource');
  if (this.Id !== null && this.Id !== undefined) {
    output.writeFieldBegin('Id', Thrift.Type.STRING, 1);
    output.writeString(this.Id);
    output.writeFieldEnd();
  }
  if (this.Name !== null && this.Name !== undefined) {
    output.writeFieldBegin('Name', Thrift.Type.STRING, 2);
    output.writeString(this.Name);
    output.writeFieldEnd();
  }
  if (this.Url !== null && this.Url !== undefined) {
    output.writeFieldBegin('Url', Thrift.Type.STRING, 3);
    output.writeString(this.Url);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ImportedDocument = function(args) {
  this.ArticleSourceId = null;
  this.Type = null;
  this.Id = null;
  this.SourceUrl = null;
  this.ImportTimestamp = null;
  this.Metadata = null;
  this.DocumentContent = null;
  this.Status = null;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    }
    if (args.Type !== undefined) {
      this.Type = args.Type;
    }
    if (args.Id !== undefined) {
      this.Id = args.Id;
    }
    if (args.SourceUrl !== undefined) {
      this.SourceUrl = args.SourceUrl;
    }
    if (args.ImportTimestamp !== undefined) {
      this.ImportTimestamp = args.ImportTimestamp;
    }
    if (args.Metadata !== undefined) {
      this.Metadata = args.Metadata;
    }
    if (args.DocumentContent !== undefined) {
      this.DocumentContent = args.DocumentContent;
    }
    if (args.Status !== undefined) {
      this.Status = args.Status;
    }
  }
};
Kraken.ImportedDocument.prototype = {};
Kraken.ImportedDocument.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.Type = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.Id = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.SourceUrl = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.ImportTimestamp = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.MAP) {
        var _size0 = 0;
        var _rtmp34;
        this.Metadata = {};
        var _ktype1 = 0;
        var _vtype2 = 0;
        _rtmp34 = input.readMapBegin();
        _ktype1 = _rtmp34.ktype;
        _vtype2 = _rtmp34.vtype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          if (_i5 > 0 ) {
            if (input.rstack.length > input.rpos[input.rpos.length -1] + 1) {
              input.rstack.pop();
            }
          }
          var key6 = null;
          var val7 = null;
          key6 = input.readString().value;
          val7 = input.readString().value;
          this.Metadata[key6] = val7;
        }
        input.readMapEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.DocumentContent = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.Status = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ImportedDocument.prototype.write = function(output) {
  output.writeStructBegin('ImportedDocument');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  if (this.Type !== null && this.Type !== undefined) {
    output.writeFieldBegin('Type', Thrift.Type.STRING, 2);
    output.writeString(this.Type);
    output.writeFieldEnd();
  }
  if (this.Id !== null && this.Id !== undefined) {
    output.writeFieldBegin('Id', Thrift.Type.STRING, 3);
    output.writeString(this.Id);
    output.writeFieldEnd();
  }
  if (this.SourceUrl !== null && this.SourceUrl !== undefined) {
    output.writeFieldBegin('SourceUrl', Thrift.Type.STRING, 4);
    output.writeString(this.SourceUrl);
    output.writeFieldEnd();
  }
  if (this.ImportTimestamp !== null && this.ImportTimestamp !== undefined) {
    output.writeFieldBegin('ImportTimestamp', Thrift.Type.STRING, 5);
    output.writeString(this.ImportTimestamp);
    output.writeFieldEnd();
  }
  if (this.Metadata !== null && this.Metadata !== undefined) {
    output.writeFieldBegin('Metadata', Thrift.Type.MAP, 6);
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRING, Thrift.objectLength(this.Metadata));
    for (var kiter8 in this.Metadata)
    {
      if (this.Metadata.hasOwnProperty(kiter8))
      {
        var viter9 = this.Metadata[kiter8];
        output.writeString(kiter8);
        output.writeString(viter9);
      }
    }
    output.writeMapEnd();
    output.writeFieldEnd();
  }
  if (this.DocumentContent !== null && this.DocumentContent !== undefined) {
    output.writeFieldBegin('DocumentContent', Thrift.Type.STRING, 7);
    output.writeString(this.DocumentContent);
    output.writeFieldEnd();
  }
  if (this.Status !== null && this.Status !== undefined) {
    output.writeFieldBegin('Status', Thrift.Type.STRING, 8);
    output.writeString(this.Status);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ArchiveDailyIndexEntry = function(args) {
  this.ArticleId = null;
  this.Url = null;
  this.Name = null;
  this.ArchiveBucket = null;
  if (args) {
    if (args.ArticleId !== undefined) {
      this.ArticleId = args.ArticleId;
    }
    if (args.Url !== undefined) {
      this.Url = args.Url;
    }
    if (args.Name !== undefined) {
      this.Name = args.Name;
    }
    if (args.ArchiveBucket !== undefined) {
      this.ArchiveBucket = args.ArchiveBucket;
    }
  }
};
Kraken.ArchiveDailyIndexEntry.prototype = {};
Kraken.ArchiveDailyIndexEntry.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.Url = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.Name = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.ArchiveBucket = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ArchiveDailyIndexEntry.prototype.write = function(output) {
  output.writeStructBegin('ArchiveDailyIndexEntry');
  if (this.ArticleId !== null && this.ArticleId !== undefined) {
    output.writeFieldBegin('ArticleId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleId);
    output.writeFieldEnd();
  }
  if (this.Url !== null && this.Url !== undefined) {
    output.writeFieldBegin('Url', Thrift.Type.STRING, 2);
    output.writeString(this.Url);
    output.writeFieldEnd();
  }
  if (this.Name !== null && this.Name !== undefined) {
    output.writeFieldBegin('Name', Thrift.Type.STRING, 3);
    output.writeString(this.Name);
    output.writeFieldEnd();
  }
  if (this.ArchiveBucket !== null && this.ArchiveBucket !== undefined) {
    output.writeFieldBegin('ArchiveBucket', Thrift.Type.STRING, 4);
    output.writeString(this.ArchiveBucket);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ArchiveDailyIndex = function(args) {
  this.ArticleSourceId = null;
  this.ArchiveDailyIndexId = null;
  this.LocalDate = null;
  this.Status = null;
  this.SourceUrl = null;
  this.Metadata = null;
  this.ArticleEntries = null;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    }
    if (args.ArchiveDailyIndexId !== undefined) {
      this.ArchiveDailyIndexId = args.ArchiveDailyIndexId;
    }
    if (args.LocalDate !== undefined) {
      this.LocalDate = args.LocalDate;
    }
    if (args.Status !== undefined) {
      this.Status = args.Status;
    }
    if (args.SourceUrl !== undefined) {
      this.SourceUrl = args.SourceUrl;
    }
    if (args.Metadata !== undefined) {
      this.Metadata = args.Metadata;
    }
    if (args.ArticleEntries !== undefined) {
      this.ArticleEntries = args.ArticleEntries;
    }
  }
};
Kraken.ArchiveDailyIndex.prototype = {};
Kraken.ArchiveDailyIndex.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.ArchiveDailyIndexId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.LocalDate = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.Status = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.SourceUrl = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.MAP) {
        var _size10 = 0;
        var _rtmp314;
        this.Metadata = {};
        var _ktype11 = 0;
        var _vtype12 = 0;
        _rtmp314 = input.readMapBegin();
        _ktype11 = _rtmp314.ktype;
        _vtype12 = _rtmp314.vtype;
        _size10 = _rtmp314.size;
        for (var _i15 = 0; _i15 < _size10; ++_i15)
        {
          if (_i15 > 0 ) {
            if (input.rstack.length > input.rpos[input.rpos.length -1] + 1) {
              input.rstack.pop();
            }
          }
          var key16 = null;
          var val17 = null;
          key16 = input.readString().value;
          val17 = input.readString().value;
          this.Metadata[key16] = val17;
        }
        input.readMapEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.LIST) {
        var _size18 = 0;
        var _rtmp322;
        this.ArticleEntries = [];
        var _etype21 = 0;
        _rtmp322 = input.readListBegin();
        _etype21 = _rtmp322.etype;
        _size18 = _rtmp322.size;
        for (var _i23 = 0; _i23 < _size18; ++_i23)
        {
          var elem24 = null;
          elem24 = new Kraken.ArchiveDailyIndexEntry();
          elem24.read(input);
          this.ArticleEntries.push(elem24);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ArchiveDailyIndex.prototype.write = function(output) {
  output.writeStructBegin('ArchiveDailyIndex');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  if (this.ArchiveDailyIndexId !== null && this.ArchiveDailyIndexId !== undefined) {
    output.writeFieldBegin('ArchiveDailyIndexId', Thrift.Type.STRING, 2);
    output.writeString(this.ArchiveDailyIndexId);
    output.writeFieldEnd();
  }
  if (this.LocalDate !== null && this.LocalDate !== undefined) {
    output.writeFieldBegin('LocalDate', Thrift.Type.STRING, 3);
    output.writeString(this.LocalDate);
    output.writeFieldEnd();
  }
  if (this.Status !== null && this.Status !== undefined) {
    output.writeFieldBegin('Status', Thrift.Type.STRING, 4);
    output.writeString(this.Status);
    output.writeFieldEnd();
  }
  if (this.SourceUrl !== null && this.SourceUrl !== undefined) {
    output.writeFieldBegin('SourceUrl', Thrift.Type.STRING, 5);
    output.writeString(this.SourceUrl);
    output.writeFieldEnd();
  }
  if (this.Metadata !== null && this.Metadata !== undefined) {
    output.writeFieldBegin('Metadata', Thrift.Type.MAP, 6);
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRING, Thrift.objectLength(this.Metadata));
    for (var kiter25 in this.Metadata)
    {
      if (this.Metadata.hasOwnProperty(kiter25))
      {
        var viter26 = this.Metadata[kiter25];
        output.writeString(kiter25);
        output.writeString(viter26);
      }
    }
    output.writeMapEnd();
    output.writeFieldEnd();
  }
  if (this.ArticleEntries !== null && this.ArticleEntries !== undefined) {
    output.writeFieldBegin('ArticleEntries', Thrift.Type.LIST, 7);
    output.writeListBegin(Thrift.Type.STRUCT, this.ArticleEntries.length);
    for (var iter27 in this.ArticleEntries)
    {
      if (this.ArticleEntries.hasOwnProperty(iter27))
      {
        iter27 = this.ArticleEntries[iter27];
        iter27.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.Article = function(args) {
  this.ArticleSourceId = null;
  this.ArticleDailyIndexId = null;
  this.Sourceurl = null;
  this.Metadata = null;
  this.Content = null;
  this.ArchiveBucket = null;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    }
    if (args.ArticleDailyIndexId !== undefined) {
      this.ArticleDailyIndexId = args.ArticleDailyIndexId;
    }
    if (args.Sourceurl !== undefined) {
      this.Sourceurl = args.Sourceurl;
    }
    if (args.Metadata !== undefined) {
      this.Metadata = args.Metadata;
    }
    if (args.Content !== undefined) {
      this.Content = args.Content;
    }
    if (args.ArchiveBucket !== undefined) {
      this.ArchiveBucket = args.ArchiveBucket;
    }
  }
};
Kraken.Article.prototype = {};
Kraken.Article.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleDailyIndexId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.Sourceurl = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.MAP) {
        var _size28 = 0;
        var _rtmp332;
        this.Metadata = {};
        var _ktype29 = 0;
        var _vtype30 = 0;
        _rtmp332 = input.readMapBegin();
        _ktype29 = _rtmp332.ktype;
        _vtype30 = _rtmp332.vtype;
        _size28 = _rtmp332.size;
        for (var _i33 = 0; _i33 < _size28; ++_i33)
        {
          if (_i33 > 0 ) {
            if (input.rstack.length > input.rpos[input.rpos.length -1] + 1) {
              input.rstack.pop();
            }
          }
          var key34 = null;
          var val35 = null;
          key34 = input.readString().value;
          val35 = input.readString().value;
          this.Metadata[key34] = val35;
        }
        input.readMapEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.Content = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.STRING) {
        this.ArchiveBucket = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.Article.prototype.write = function(output) {
  output.writeStructBegin('Article');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  if (this.ArticleDailyIndexId !== null && this.ArticleDailyIndexId !== undefined) {
    output.writeFieldBegin('ArticleDailyIndexId', Thrift.Type.STRING, 2);
    output.writeString(this.ArticleDailyIndexId);
    output.writeFieldEnd();
  }
  if (this.Sourceurl !== null && this.Sourceurl !== undefined) {
    output.writeFieldBegin('Sourceurl', Thrift.Type.STRING, 3);
    output.writeString(this.Sourceurl);
    output.writeFieldEnd();
  }
  if (this.Metadata !== null && this.Metadata !== undefined) {
    output.writeFieldBegin('Metadata', Thrift.Type.MAP, 4);
    output.writeMapBegin(Thrift.Type.STRING, Thrift.Type.STRING, Thrift.objectLength(this.Metadata));
    for (var kiter36 in this.Metadata)
    {
      if (this.Metadata.hasOwnProperty(kiter36))
      {
        var viter37 = this.Metadata[kiter36];
        output.writeString(kiter36);
        output.writeString(viter37);
      }
    }
    output.writeMapEnd();
    output.writeFieldEnd();
  }
  if (this.Content !== null && this.Content !== undefined) {
    output.writeFieldBegin('Content', Thrift.Type.STRING, 5);
    output.writeString(this.Content);
    output.writeFieldEnd();
  }
  if (this.ArchiveBucket !== null && this.ArchiveBucket !== undefined) {
    output.writeFieldBegin('ArchiveBucket', Thrift.Type.STRING, 6);
    output.writeString(this.ArchiveBucket);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ListArchiveDailyIndicesRequest = function(args) {
  this.ArticleSourceId = null;
  this.LatestLocalDate = null;
  this.Limit = 10;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field ArticleSourceId is unset!');
    }
    if (args.LatestLocalDate !== undefined) {
      this.LatestLocalDate = args.LatestLocalDate;
    }
    if (args.Limit !== undefined) {
      this.Limit = args.Limit;
    }
  }
};
Kraken.ListArchiveDailyIndicesRequest.prototype = {};
Kraken.ListArchiveDailyIndicesRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.LatestLocalDate = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.Limit = input.readI32().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.ListArchiveDailyIndicesRequest.prototype.write = function(output) {
  output.writeStructBegin('ListArchiveDailyIndicesRequest');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  if (this.LatestLocalDate !== null && this.LatestLocalDate !== undefined) {
    output.writeFieldBegin('LatestLocalDate', Thrift.Type.STRING, 2);
    output.writeString(this.LatestLocalDate);
    output.writeFieldEnd();
  }
  if (this.Limit !== null && this.Limit !== undefined) {
    output.writeFieldBegin('Limit', Thrift.Type.I32, 3);
    output.writeI32(this.Limit);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.GetArticleSourceRequest = function(args) {
  this.ArticleSourceId = null;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field ArticleSourceId is unset!');
    }
  }
};
Kraken.GetArticleSourceRequest.prototype = {};
Kraken.GetArticleSourceRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.GetArticleSourceRequest.prototype.write = function(output) {
  output.writeStructBegin('GetArticleSourceRequest');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.GenericDocumentRequest = function(args) {
  this.ArticleSourceId = null;
  this.DocumentType = null;
  this.DocumentId = null;
  this.ArchiveBucket = null;
  this.MetadataOnly = null;
  if (args) {
    if (args.ArticleSourceId !== undefined) {
      this.ArticleSourceId = args.ArticleSourceId;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field ArticleSourceId is unset!');
    }
    if (args.DocumentType !== undefined) {
      this.DocumentType = args.DocumentType;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field DocumentType is unset!');
    }
    if (args.DocumentId !== undefined) {
      this.DocumentId = args.DocumentId;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field DocumentId is unset!');
    }
    if (args.ArchiveBucket !== undefined) {
      this.ArchiveBucket = args.ArchiveBucket;
    }
    if (args.MetadataOnly !== undefined) {
      this.MetadataOnly = args.MetadataOnly;
    }
  }
};
Kraken.GenericDocumentRequest.prototype = {};
Kraken.GenericDocumentRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.ArticleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.DocumentType = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.DocumentId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.ArchiveBucket = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.BOOL) {
        this.MetadataOnly = input.readBool().value;
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.GenericDocumentRequest.prototype.write = function(output) {
  output.writeStructBegin('GenericDocumentRequest');
  if (this.ArticleSourceId !== null && this.ArticleSourceId !== undefined) {
    output.writeFieldBegin('ArticleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.ArticleSourceId);
    output.writeFieldEnd();
  }
  if (this.DocumentType !== null && this.DocumentType !== undefined) {
    output.writeFieldBegin('DocumentType', Thrift.Type.STRING, 2);
    output.writeString(this.DocumentType);
    output.writeFieldEnd();
  }
  if (this.DocumentId !== null && this.DocumentId !== undefined) {
    output.writeFieldBegin('DocumentId', Thrift.Type.STRING, 3);
    output.writeString(this.DocumentId);
    output.writeFieldEnd();
  }
  if (this.ArchiveBucket !== null && this.ArchiveBucket !== undefined) {
    output.writeFieldBegin('ArchiveBucket', Thrift.Type.STRING, 4);
    output.writeString(this.ArchiveBucket);
    output.writeFieldEnd();
  }
  if (this.MetadataOnly !== null && this.MetadataOnly !== undefined) {
    output.writeFieldBegin('MetadataOnly', Thrift.Type.BOOL, 5);
    output.writeBool(this.MetadataOnly);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_IMPORTED = 'InvalidDocumentId.NotImported';
Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED = 'InvalidDocumentId.NotParsed';
Kraken.TYPE_DAILY_INDEX = 'ARCHIVE_DAILY_INDEX';
Kraken.TYPE_ARTICLE = 'ARTICLE';
Kraken.STATUS_UNKNOWN = 'UNKNOWN';
Kraken.STATUS_NOT_FOUND = 'NOT_FOUND';
Kraken.STATUS_IMPORTED = 'IMPORTED';
Kraken.STATUS_READY = 'READY';
