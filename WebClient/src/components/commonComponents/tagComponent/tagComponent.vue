<template src="./tagComponent.template.html"></template>
<script type="text/javascript">
    export default {
        name: "tagComponent",
        props: ["entityId", "entityTypeId", "canReadOnly", "assignCallback","showTag", "isDisabled","deAssignCallback", "clearTags", "viewId"],
        data() {
            return {
               
                tagsList: [],
                searchTag: null,
                showAutoComplete: false,
                entityTags: [],
                selectedFilterColumn: false
            };
        },
        methods: {
            showFilterByType() {
                let vm = this;
                setTimeout(function () {

                    vm.selectedFilterColumn = !vm.selectedFilterColumn;
                    $("#taglist").show();
                    vm.getClientTags('');
                }, 10);

            },

            getEntityTags() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler",
                    {
                        key: "GetEntityTags",
                        params: {
                            EntityTypeId: vm.entityTypeId,
                            EntityId: vm.entityId
                        },
                        callback: function (err, response) {
                            if (err) {
                                return;
                            }
                            if (response) {
                                vm.entityTags.splice(0, vm.entityTags.length, ...response.entityTagsList);
                            }
                        }
                    });
            },
            addTag: function (tag) {
                let vm = this;
                vm.entityTags.push(tag);
                vm.searchTag = null;
            },
            deleteSelectedTag(tagIndex, tagObj) {
                let vm = this;
                if (!vm.canReadOnly) {
                    vm.$store.dispatch("dataRequestHandler",
                        {
                            key: "DeleteTagFromEntity",
                            params: {
                                TagId: tagObj.TagId,
                                EntityId: vm.entityId
                            },
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                if (response) {
                                    vm.entityTags.splice(tagIndex, 1);
                                }
                            }
                        });
                }
                else {
                    vm.entityTags.splice(tagIndex, 1);
                    vm.deAssignCallback(tagObj);
                }

            },
            getClientTags(searchText) {
                let vm = this;
                console.log("searchText", searchText)
                vm.$store.dispatch("dataRequestHandler",
                    {
                        key: "GetClientTagsBySearchText",
                        params: {
                            searchText: searchText
                        },
                        callback: function (err, response) {
                            if (err) {
                                console.log("err", err);
                                return;
                            }
                            if (response) {

                                vm.tagsList.splice(0, vm.tagsList.length, ...response[0]);
                                console.log("response", vm.tagsList);
                            }
                            if (vm.tagsList.length)
                                vm.showAutoComplete = true;
                        }
                    });
            },
            createNewTag() {
                let vm = this;
                if (vm.searchTag) {
                    vm.$store.dispatch("dataRequestHandler",
                        {
                            key: "SaveEntityTag",
                            params: {
                                TagId: -1,
                                TagName: vm.searchTag,
                                EntityId: vm.entityId,
                                EntityTypeId: vm.entityTypeId
                            },
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                if (response) {
                                    let newTagObj = response.recordsets[0][0];
                                    vm.entityTags.push({ TagId: newTagObj.TagId, TagName: newTagObj.TagName });
                                    vm.searchTag = null;
                                }
                            }
                        });
                }
            },
            onChangeTag: function (tag) {
                let vm = this;
                vm.searchTag = null;
                if (!vm.canReadOnly) {
                    vm.$store.dispatch("dataRequestHandler",
                        {
                            key: "SaveEntityTag",
                            params: {
                                TagId: tag.TagId,
                                TagName: tag.TagName,
                                EntityId: vm.entityId,
                                EntityTypeId: vm.entityTypeId
                            },
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                if (response) {
                                    vm.entityTags.push(tag);
                                }
                            }
                        });
                }
                else {
                    vm.entityTags.push(tag);
                    vm.assignCallback(tag);
                }
            },
            getEntityViewTags() {
                let vm = this;
                if (vm.viewId) {
                    vm.$store.dispatch("dataRequestHandler",
                        {
                            key: "GetEntityViewTags",
                            params: {
                                ViewId: vm.viewId
                            },
                            callback: function (err, response) {
                                if (err) {
                                    return;
                                }
                                if (response) {
                                    vm.entityTags.splice(0, vm.entityTags.length, ...response.entityTagsList);
                                    //Adding tags to the Filters to SaveAs/Update
                                    for (let index = 0; index < response.entityTagsList.length; index++) {
                                        vm.assignCallback(response.entityTagsList[index]);
                                    }
                                }
                            }
                        });
                }
            }
        },
        computed: {


        },
        mounted() {
            this.getEntityTags();
            $(document).click(function (e) {
                console.log("clicked on doc");
                $("#taglist").hide();
                // vm.showLedgerAccounts = false;
                // vm.showAmenitiesList =false;
            })


        },
        beforeDestroy() {
            //   $(document).unbind( "click");
        },
        watch: {

            searchTag(newValue, oldValue) {
                let vm = this;
                vm.getClientTags(newValue);
            },
            clearTags(value) {
                if (value) {
                    this.entityTags.splice(0, this.entityTags.length);
                }
            },
            viewId() {
                this.getEntityViewTags();
            }
        },
        destroyed() {

        }
    };

</script>