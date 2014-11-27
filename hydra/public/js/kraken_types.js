//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//


if (typeof Kraken === 'undefined') {
  Kraken = {};
}
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

