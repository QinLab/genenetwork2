// Generated by CoffeeScript 1.8.0
$(function() {
  var apply_default, check_search_term, dataset_info, group_info, make_default, open_window, populate_dataset, populate_group, populate_species, populate_type, process_json, redo_dropdown;
  process_json = function(data) {
    window.jdata = data;
    populate_species();
    return apply_default();
  };
  $.ajax('/static/new/javascript/dataset_menu_structure.json', {
    dataType: 'json',
    success: process_json
  });
  populate_species = function() {
    var species_list;
    species_list = this.jdata.species;
    redo_dropdown($('#species'), species_list);
    return populate_group();
  };
  window.populate_species = populate_species;
  populate_group = function() {
    var group_list, species;
    console.log("in populate group");
    species = $('#species').val();
    group_list = this.jdata.groups[species];
    redo_dropdown($('#group'), group_list);
    return populate_type();
  };
  window.populate_group = populate_group;
  populate_type = function() {
    var group, species, type_list;
    console.log("in populate type");
    species = $('#species').val();
    group = $('#group').val();
    type_list = this.jdata.types[species][group];
    redo_dropdown($('#type'), type_list);
    return populate_dataset();
  };
  window.populate_type = populate_type;
  populate_dataset = function() {
    var dataset_list, group, species, type;
    console.log("in populate dataset");
    species = $('#species').val();
    group = $('#group').val();
    type = $('#type').val();
    console.log("sgt:", species, group, type);
    dataset_list = this.jdata.datasets[species][group][type];
    console.log("pop_dataset:", dataset_list);
    return redo_dropdown($('#dataset'), dataset_list);
  };
  window.populate_dataset = populate_dataset;
  redo_dropdown = function(dropdown, items) {
    var item, _i, _len, _results;
    console.log("in redo:", dropdown, items);
    dropdown.empty();
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      if (item.length > 2){
        _results.push(dropdown.append($("<option data-id=\""+item[0]+"\" />").val(item[1]).text(item[2])));
      } else {
        _results.push(dropdown.append($("<option />").val(item[0]).text(item[1])));
      }
    }
    return _results;
  };
  $('#species').change((function(_this) {
    return function() {
      return populate_group();
    };
  })(this));
  $('#group').change((function(_this) {
    return function() {
      return populate_type();
    };
  })(this));
  $('#type').change((function(_this) {
    return function() {
      return populate_dataset();
    };
  })(this));
  open_window = function(url, name) {
    var options;
    options = "menubar=1,toolbar=1,location=1,resizable=1,status=1,scrollbars=1,directories=1,width=900";
    return open(url, name, options).focus();
  };
  group_info = function() {
    var group, species, url;
    species = $('#species').val();
    group = $('#group').val();
    url = "/" + species + "Cross.html#" + group;
    return open_window(url, "Group Info");
  };
  $('#group_info').click(group_info);
  dataset_info = function() {
    var dataset, url;
    accession_id = $('#dataset option:selected').data("id");
    url = "http://genenetwork.org/webqtl/main.py?FormID=sharinginfo&GN_AccessionId=" + accession_id;
    return open_window(url, "Dataset Info");
  };
  $('#dataset_info').click(dataset_info);
  make_default = function() {
    var holder, item, jholder, _i, _len, _ref;
    alert("The current settings are now your default.")
    holder = {};
    _ref = ['species', 'group', 'type', 'dataset'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      holder[item] = $("#" + item).val();
    }
    jholder = JSON.stringify(holder);
    return $.cookie('search_defaults', jholder, {
      expires: 365
    });
  };
  apply_default = function() {
    var defaults, item, populate_function, _i, _len, _ref, _results;
    defaults = $.cookie('search_defaults');
    if (defaults) {
      defaults = $.parseJSON(defaults);
    } else {
      defaults = {
        species: "mouse",
        group: "BXD",
        type: "Hippocampus mRNA",
        dataset: "HC_M2_0606_P"
      };
    }
    _ref = [['species', 'group'], ['group', 'type'], ['type', 'dataset'], ['dataset', null]];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      $("#" + item[0]).val(defaults[item[0]]);
      if (item[1]) {
        populate_function = "populate_" + item[1];
        console.log("Calling:", populate_function);
        _results.push(window[populate_function]());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  check_search_term = function() {
    var or_search_term, and_search_term;
    or_search_term = $('#or_search').val();
    and_search_term = $('#and_search').val();
    console.log("or_search_term:", or_search_term);
    console.log("and_search_term:", and_search_term);
    if (or_search_term === "" && and_search_term === "") {
      alert("Please enter one or more search terms or search equations.");
      return false;
    }
  };
  $("#make_default").click(make_default);
  return $("#btsearch").click(check_search_term);
});