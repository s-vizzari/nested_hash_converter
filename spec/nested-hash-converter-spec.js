/*global require, describe, it, expect*/

describe('NestedHashConverter', function() {

  var NestedHashConverter = require('lib/nested-hash-converter');

  it("adds leaf nodes at root level in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1", 1)
      .add("item 2", 2)
      .add("item 3", 3)
      .toList();

    expect(list.length).toEqual(3);

    expect(list[0].id).toEqual(1);
    expect(list[1].id).toEqual(2);
    expect(list[2].id).toEqual(3);

    expect(list[0].label).toEqual("item 1");
    expect(list[1].label).toEqual("item 2");
    expect(list[2].label).toEqual("item 3");
  });

  it("adds non-leaf nodes and then adds leaf nodes at the same level in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1::item A", 1)
      .add("item 1::item B", 2)
      .add("item 1::item C", 3)
      .toList();

    expect(list.length).toEqual(1);

    expect(list[0].children[0].id).toEqual(1);
    expect(list[0].children[1].id).toEqual(2);
    expect(list[0].children[2].id).toEqual(3);

    expect(list[0].children[0].label).toEqual("item A");
    expect(list[0].children[1].label).toEqual("item B");
    expect(list[0].children[2].label).toEqual("item C");
  });

  it("adds leaf nodes with same label at root level in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1", 1)
      .add("item 1", 2)
      .add("item 1", 3)
      .toList();

    expect(list.length).toEqual(3);

    expect(list[0].id).toEqual(1);
    expect(list[1].id).toEqual(2);
    expect(list[2].id).toEqual(3);

    expect(list[0].label).toEqual("item 1");
    expect(list[1].label).toEqual("item 1");
    expect(list[2].label).toEqual("item 1");
  });

  it("adds leaf nodes with same label at the same level in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1::item A", 1)
      .add("item 1::item A", 2)
      .add("item 1::item A", 3)
      .toList();

    expect(list.length).toEqual(1);

    expect(list[0].children[0].id).toEqual(1);
    expect(list[0].children[1].id).toEqual(2);
    expect(list[0].children[2].id).toEqual(3);

    expect(list[0].children[0].label).toEqual("item A");
    expect(list[0].children[1].label).toEqual("item A");
    expect(list[0].children[2].label).toEqual("item A");
  });

  it("adds leaf nodes with same label with following non-leaf node with same label in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1", 1)
      .add("item 1", 2)
      .add("item 1::item A", 3)
      .toList();

    expect(list.length).toEqual(1);

    expect(list[0].children[0].id).toEqual(1);
    expect(list[0].children[1].id).toEqual(2);
    expect(list[0].children[2].id).toEqual(3);

    expect(list[0].children[0].label).toEqual("item 1");
    expect(list[0].children[1].label).toEqual("item 1");
    expect(list[0].children[2].label).toEqual("item A");
  });

  it("adds leaf nodes with same label with preceding non-leaf node with same label in proper order", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1::item A", 1)
      .add("item 1", 2)
      .add("item 1", 3)
      .toList();

    expect(list.length).toEqual(1);

    expect(list[0].children[0].id).toEqual(2);
    expect(list[0].children[1].id).toEqual(3);
    expect(list[0].children[2].id).toEqual(1);

    expect(list[0].children[0].label).toEqual("item 1");
    expect(list[0].children[1].label).toEqual("item 1");
    expect(list[0].children[2].label).toEqual("item A");
  });

  it("adds nodes ascending in depth", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1", 1)
      .add("item 2::item 2A", 2)
      .add("item 3::item 3A::item 3B", 3)
      .toList();

    expect(list.length).toEqual(3);

    expect(list[0].id).toEqual(1);
    expect(list[1].children[0].id).toEqual(2);
    expect(list[2].children[0].children[0].id).toEqual(3);

    expect(list[0].label).toEqual("item 1");
    expect(list[1].children[0].label).toEqual("item 2A");
    expect(list[2].children[0].children[0].label).toEqual("item 3B");
  });

  it("adds nodes descending in depth", function() {
    var converter = new NestedHashConverter();

    var list = converter
      .add("item 1::item 1A::item 1B", 1)
      .add("item 2::item 2A", 2)
      .add("item 3", 3)
      .toList();

    expect(list.length).toEqual(3);

    expect(list[0].children[0].children[0].id).toEqual(1);
    expect(list[1].children[0].id).toEqual(2);
    expect(list[2].id).toEqual(3);

    expect(list[0].children[0].children[0].label).toEqual("item 1B");
    expect(list[1].children[0].label).toEqual("item 2A");
    expect(list[2].label).toEqual("item 3");
  });

  describe('#toFlattenedList', function() {

    it('flattens a list with nested nodes into a single-level Array', function() {
      var converter = new NestedHashConverter();

      var list = converter
        .add("item 1::item 1A::item 1B", 1)
        .add("item 2::item 2A", 2)
        .add("item 3", 3)
        .toFlattenedList();

      expect(list.length).toEqual(6);
      expect(list[0].label).toEqual('item 1');
      expect(list[1].label).toEqual('item 1A');
      expect(list[2].label).toEqual('item 1B');
      expect(list[3].label).toEqual('item 2');
      expect(list[4].label).toEqual('item 2A');
      expect(list[5].label).toEqual('item 3');
    });

    it('flattens a list with nested nodes where a custom delimiter is used', function() {
      var converter = new NestedHashConverter('#~');

      var list = converter
        .add("item 1#~item 1A#~item 1B", 1)
        .add("item 2#~item 2A", 2)
        .add("item 3", 3)
        .toFlattenedList();

      expect(list.length).toEqual(6);
      expect(list[0].label).toEqual('item 1');
      expect(list[1].label).toEqual('item 1A');
      expect(list[2].label).toEqual('item 1B');
      expect(list[3].label).toEqual('item 2');
      expect(list[4].label).toEqual('item 2A');
      expect(list[5].label).toEqual('item 3');
    });

  });

});
