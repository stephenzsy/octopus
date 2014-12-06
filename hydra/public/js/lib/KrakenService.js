//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//


//HELPER FUNCTIONS AND STRUCTURES

Kraken.KrakenService_ping_args = function(args) {
};
Kraken.KrakenService_ping_args.prototype = {};
Kraken.KrakenService_ping_args.prototype.read = function(input) {
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
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.KrakenService_ping_args.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ping_args');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_ping_result = function(args) {
};
Kraken.KrakenService_ping_result.prototype = {};
Kraken.KrakenService_ping_result.prototype.read = function(input) {
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
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.KrakenService_ping_result.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ping_result');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_ListArticleSources_args = function(args) {
};
Kraken.KrakenService_ListArticleSources_args.prototype = {};
Kraken.KrakenService_ListArticleSources_args.prototype.read = function(input) {
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
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Kraken.KrakenService_ListArticleSources_args.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ListArticleSources_args');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_ListArticleSources_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
Kraken.KrakenService_ListArticleSources_result.prototype = {};
Kraken.KrakenService_ListArticleSources_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.success = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = new Kraken.ArticleSource();
          elem6.read(input);
          this.success.push(elem6);
        }
        input.readListEnd();
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

Kraken.KrakenService_ListArticleSources_result.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ListArticleSources_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.LIST, 0);
    output.writeListBegin(Thrift.Type.STRUCT, this.success.length);
    for (var iter7 in this.success)
    {
      if (this.success.hasOwnProperty(iter7))
      {
        iter7 = this.success[iter7];
        iter7.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_GetArticleSource_args = function(args) {
  this.request = null;
  if (args) {
    if (args.request !== undefined) {
      this.request = args.request;
    }
  }
};
Kraken.KrakenService_GetArticleSource_args.prototype = {};
Kraken.KrakenService_GetArticleSource_args.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRUCT) {
        this.request = new Kraken.GetArticleSourceRequest();
        this.request.read(input);
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

Kraken.KrakenService_GetArticleSource_args.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_GetArticleSource_args');
  if (this.request !== null && this.request !== undefined) {
    output.writeFieldBegin('request', Thrift.Type.STRUCT, 1);
    this.request.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_GetArticleSource_result = function(args) {
  this.success = null;
  this.e = null;
  if (args instanceof Kraken.InvalidArticleSourceIdNotFound) {
    this.e = args;
    return;
  }
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
    if (args.e !== undefined) {
      this.e = args.e;
    }
  }
};
Kraken.KrakenService_GetArticleSource_result.prototype = {};
Kraken.KrakenService_GetArticleSource_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new Kraken.ArticleSource();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.e = new Kraken.InvalidArticleSourceIdNotFound();
        this.e.read(input);
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

Kraken.KrakenService_GetArticleSource_result.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_GetArticleSource_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  if (this.e !== null && this.e !== undefined) {
    output.writeFieldBegin('e', Thrift.Type.STRUCT, 1);
    this.e.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_GetArchiveDailyIndex_args = function(args) {
  this.request = null;
  if (args) {
    if (args.request !== undefined) {
      this.request = args.request;
    }
  }
};
Kraken.KrakenService_GetArchiveDailyIndex_args.prototype = {};
Kraken.KrakenService_GetArchiveDailyIndex_args.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRUCT) {
        this.request = new Kraken.GetArchiveDailyIndexRequest();
        this.request.read(input);
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

Kraken.KrakenService_GetArchiveDailyIndex_args.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_GetArchiveDailyIndex_args');
  if (this.request !== null && this.request !== undefined) {
    output.writeFieldBegin('request', Thrift.Type.STRUCT, 1);
    this.request.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_GetArchiveDailyIndex_result = function(args) {
  this.success = null;
  this.e = null;
  if (args instanceof Kraken.InvalidArticleSourceIdNotFound) {
    this.e = args;
    return;
  }
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
    if (args.e !== undefined) {
      this.e = args.e;
    }
  }
};
Kraken.KrakenService_GetArchiveDailyIndex_result.prototype = {};
Kraken.KrakenService_GetArchiveDailyIndex_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new Kraken.ArchiveDailyIndex();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.e = new Kraken.InvalidArticleSourceIdNotFound();
        this.e.read(input);
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

Kraken.KrakenService_GetArchiveDailyIndex_result.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_GetArchiveDailyIndex_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  if (this.e !== null && this.e !== undefined) {
    output.writeFieldBegin('e', Thrift.Type.STRUCT, 1);
    this.e.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_ImportDocument_args = function(args) {
  this.articleSourceId = null;
  this.type = null;
  this.localDate = null;
  if (args) {
    if (args.articleSourceId !== undefined) {
      this.articleSourceId = args.articleSourceId;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.localDate !== undefined) {
      this.localDate = args.localDate;
    }
  }
};
Kraken.KrakenService_ImportDocument_args.prototype = {};
Kraken.KrakenService_ImportDocument_args.prototype.read = function(input) {
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
        this.articleSourceId = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.type = input.readString().value;
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.localDate = input.readString().value;
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

Kraken.KrakenService_ImportDocument_args.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ImportDocument_args');
  if (this.articleSourceId !== null && this.articleSourceId !== undefined) {
    output.writeFieldBegin('articleSourceId', Thrift.Type.STRING, 1);
    output.writeString(this.articleSourceId);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.STRING, 2);
    output.writeString(this.type);
    output.writeFieldEnd();
  }
  if (this.localDate !== null && this.localDate !== undefined) {
    output.writeFieldBegin('localDate', Thrift.Type.STRING, 3);
    output.writeString(this.localDate);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenService_ImportDocument_result = function(args) {
  this.success = null;
  this.e = null;
  if (args instanceof Kraken.InvalidArticleSourceIdNotFound) {
    this.e = args;
    return;
  }
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
    if (args.e !== undefined) {
      this.e = args.e;
    }
  }
};
Kraken.KrakenService_ImportDocument_result.prototype = {};
Kraken.KrakenService_ImportDocument_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new Kraken.ImportedDocument();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.e = new Kraken.InvalidArticleSourceIdNotFound();
        this.e.read(input);
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

Kraken.KrakenService_ImportDocument_result.prototype.write = function(output) {
  output.writeStructBegin('KrakenService_ImportDocument_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  if (this.e !== null && this.e !== undefined) {
    output.writeFieldBegin('e', Thrift.Type.STRUCT, 1);
    this.e.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Kraken.KrakenServiceClient = function(input, output) {
    this.input = input;
    this.output = (!output) ? input : output;
    this.seqid = 0;
};
Kraken.KrakenServiceClient.prototype = {};
Kraken.KrakenServiceClient.prototype.ping = function(callback) {
  if (callback === undefined) {
    this.send_ping();
    this.recv_ping();
  } else {
    var postData = this.send_ping(true);
    return this.output.getTransport()
      .jqRequest(this, postData, arguments, this.recv_ping);
  }
};

Kraken.KrakenServiceClient.prototype.send_ping = function(callback) {
  this.output.writeMessageBegin('ping', Thrift.MessageType.CALL, this.seqid);
  var args = new Kraken.KrakenService_ping_args();
  args.write(this.output);
  this.output.writeMessageEnd();
  return this.output.getTransport().flush(callback);
};

Kraken.KrakenServiceClient.prototype.recv_ping = function() {
  var ret = this.input.readMessageBegin();
  var fname = ret.fname;
  var mtype = ret.mtype;
  var rseqid = ret.rseqid;
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(this.input);
    this.input.readMessageEnd();
    throw x;
  }
  var result = new Kraken.KrakenService_ping_result();
  result.read(this.input);
  this.input.readMessageEnd();

  return;
};
Kraken.KrakenServiceClient.prototype.ListArticleSources = function(callback) {
  if (callback === undefined) {
    this.send_ListArticleSources();
    return this.recv_ListArticleSources();
  } else {
    var postData = this.send_ListArticleSources(true);
    return this.output.getTransport()
      .jqRequest(this, postData, arguments, this.recv_ListArticleSources);
  }
};

Kraken.KrakenServiceClient.prototype.send_ListArticleSources = function(callback) {
  this.output.writeMessageBegin('ListArticleSources', Thrift.MessageType.CALL, this.seqid);
  var args = new Kraken.KrakenService_ListArticleSources_args();
  args.write(this.output);
  this.output.writeMessageEnd();
  return this.output.getTransport().flush(callback);
};

Kraken.KrakenServiceClient.prototype.recv_ListArticleSources = function() {
  var ret = this.input.readMessageBegin();
  var fname = ret.fname;
  var mtype = ret.mtype;
  var rseqid = ret.rseqid;
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(this.input);
    this.input.readMessageEnd();
    throw x;
  }
  var result = new Kraken.KrakenService_ListArticleSources_result();
  result.read(this.input);
  this.input.readMessageEnd();

  if (null !== result.success) {
    return result.success;
  }
  throw 'ListArticleSources failed: unknown result';
};
Kraken.KrakenServiceClient.prototype.GetArticleSource = function(request, callback) {
  if (callback === undefined) {
    this.send_GetArticleSource(request);
    return this.recv_GetArticleSource();
  } else {
    var postData = this.send_GetArticleSource(request, true);
    return this.output.getTransport()
      .jqRequest(this, postData, arguments, this.recv_GetArticleSource);
  }
};

Kraken.KrakenServiceClient.prototype.send_GetArticleSource = function(request, callback) {
  this.output.writeMessageBegin('GetArticleSource', Thrift.MessageType.CALL, this.seqid);
  var args = new Kraken.KrakenService_GetArticleSource_args();
  args.request = request;
  args.write(this.output);
  this.output.writeMessageEnd();
  return this.output.getTransport().flush(callback);
};

Kraken.KrakenServiceClient.prototype.recv_GetArticleSource = function() {
  var ret = this.input.readMessageBegin();
  var fname = ret.fname;
  var mtype = ret.mtype;
  var rseqid = ret.rseqid;
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(this.input);
    this.input.readMessageEnd();
    throw x;
  }
  var result = new Kraken.KrakenService_GetArticleSource_result();
  result.read(this.input);
  this.input.readMessageEnd();

  if (null !== result.e) {
    throw result.e;
  }
  if (null !== result.success) {
    return result.success;
  }
  throw 'GetArticleSource failed: unknown result';
};
Kraken.KrakenServiceClient.prototype.GetArchiveDailyIndex = function(request, callback) {
  if (callback === undefined) {
    this.send_GetArchiveDailyIndex(request);
    return this.recv_GetArchiveDailyIndex();
  } else {
    var postData = this.send_GetArchiveDailyIndex(request, true);
    return this.output.getTransport()
      .jqRequest(this, postData, arguments, this.recv_GetArchiveDailyIndex);
  }
};

Kraken.KrakenServiceClient.prototype.send_GetArchiveDailyIndex = function(request, callback) {
  this.output.writeMessageBegin('GetArchiveDailyIndex', Thrift.MessageType.CALL, this.seqid);
  var args = new Kraken.KrakenService_GetArchiveDailyIndex_args();
  args.request = request;
  args.write(this.output);
  this.output.writeMessageEnd();
  return this.output.getTransport().flush(callback);
};

Kraken.KrakenServiceClient.prototype.recv_GetArchiveDailyIndex = function() {
  var ret = this.input.readMessageBegin();
  var fname = ret.fname;
  var mtype = ret.mtype;
  var rseqid = ret.rseqid;
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(this.input);
    this.input.readMessageEnd();
    throw x;
  }
  var result = new Kraken.KrakenService_GetArchiveDailyIndex_result();
  result.read(this.input);
  this.input.readMessageEnd();

  if (null !== result.e) {
    throw result.e;
  }
  if (null !== result.success) {
    return result.success;
  }
  throw 'GetArchiveDailyIndex failed: unknown result';
};
Kraken.KrakenServiceClient.prototype.ImportDocument = function(articleSourceId, type, localDate, callback) {
  if (callback === undefined) {
    this.send_ImportDocument(articleSourceId, type, localDate);
    return this.recv_ImportDocument();
  } else {
    var postData = this.send_ImportDocument(articleSourceId, type, localDate, true);
    return this.output.getTransport()
      .jqRequest(this, postData, arguments, this.recv_ImportDocument);
  }
};

Kraken.KrakenServiceClient.prototype.send_ImportDocument = function(articleSourceId, type, localDate, callback) {
  this.output.writeMessageBegin('ImportDocument', Thrift.MessageType.CALL, this.seqid);
  var args = new Kraken.KrakenService_ImportDocument_args();
  args.articleSourceId = articleSourceId;
  args.type = type;
  args.localDate = localDate;
  args.write(this.output);
  this.output.writeMessageEnd();
  return this.output.getTransport().flush(callback);
};

Kraken.KrakenServiceClient.prototype.recv_ImportDocument = function() {
  var ret = this.input.readMessageBegin();
  var fname = ret.fname;
  var mtype = ret.mtype;
  var rseqid = ret.rseqid;
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(this.input);
    this.input.readMessageEnd();
    throw x;
  }
  var result = new Kraken.KrakenService_ImportDocument_result();
  result.read(this.input);
  this.input.readMessageEnd();

  if (null !== result.e) {
    throw result.e;
  }
  if (null !== result.success) {
    return result.success;
  }
  throw 'ImportDocument failed: unknown result';
};
