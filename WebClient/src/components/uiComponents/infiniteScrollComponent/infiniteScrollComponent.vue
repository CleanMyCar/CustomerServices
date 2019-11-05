<template src="./infiniteScrollComponent.template.html"></template>
<script>  
    import SizeAndPositionManager from "./sizeAndPositionManager"
    export default {
        name: "infiniteScrollComponent",
        props: ["estimatedItemSize", "height", "overscanCount", "renderItem", "itemCount", "itemSize", "onItemsRendered", "onScroll",
            "scrollDirection", "scrollOffset", "scrollToIndex", "scrollToAlignment", "style", "width"],
        data() {
            return {
                sizeAndPositionManager: null,
                offset: 0,
                scrollChangeReason: SCROLL_CHANGE_REQUESTED,
                DIRECTION_VERTICAL: 'vertical',
                DIRECTION_HORIZONTAL: 'horizontal',
                SCROLL_CHANGE_OBSERVED: 'observed',
                SCROLL_CHANGE_REQUESTED: 'requested',
                scrollProp: { DIRECTION_VERTICAL: 'scrollTop', DIRECTION_HORIZONTAL: 'scrollLeft' },
                sizeProp: { DIRECTION_VERTICAL: 'height', DIRECTION_HORIZONTAL: 'width' },
                positionProp: { DIRECTION_VERTICAL: 'top', DIRECTION_HORIZONTAL: 'left' },
                styleCache: {},
                rootNode: null,
                onScroll: null,
                STYLE_ITEM: {
                    position: 'absolute',
                    left: 0,
                    width: '100%'
                },
                STYLE_WRAPPER: {
                    overflow: 'auto',
                    willChange: 'transform',
                    WebkitOverflowScrolling: 'touch'
                },
                STYLE_INNER: {
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    minHeight: '100%'
                },
                defaultProps: {
                    overscanCount: 3,
                    scrollDirection: 'vertical',
                    width: '100%'
                }
            };
        },
        methods: {
            getRef: function (node) {
                this.rootNode = node;
            },
            getSize() {
                var itemSize = this.itemSize;
                if (typeof itemSize === 'function') {
                    return itemSize(index);
                }
                return Array.isArray(itemSize) ? itemSize[index] : itemSize;
            },
            getEstimatedItemSize() {
                return this.estimatedItemSize || typeof this.itemSize === 'number' && this.itemSize || 50;
            },
            getOffsetForIndex(index, scrollToAlignment, itemCount) {
                if (scrollToAlignment === void 0) {
                    scrollToAlignment = this.scrollToAlignment;
                }
                if (itemCount === void 0) {
                    itemCount = this.itemCount;
                }
                var _a = this.scrollDirection,
                    scrollDirection = _a === void 0 ? this.DIRECTION_VERTICAL : _a;
                if (index < 0 || index >= itemCount) {
                    index = 0;
                }
                return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
                    align: scrollToAlignment,
                    containerSize: this.sizeProp[scrollDirection],
                    currentOffset: this.offset || 0,
                    targetIndex: index
                });
            },
            handleScroll(e) {
                var onScroll = this.onScroll;
                var offset = this.getNodeOffset();
                if (offset < 0 || this.offset === offset || e.target !== this.rootNode) {
                    return;
                }

                this.offset = offset;
                this.scrollChangeReason = SCROLL_CHANGE_OBSERVED;

                if (typeof onScroll === 'function') {
                    this.onScroll(offset, e);
                }
            },
            getNodeOffset: function () {
                var _a = this.scrollDirection,
                    scrollDirection = _a === void 0 ? this.DIRECTION_VERTICAL : _a;
                return this.rootNode[this.scrollProp[scrollDirection]];
            },
            getStyle(index) {
                var style = this.styleCache[index];
                if (style) {
                    return style;
                }
                var _a = this.scrollDirection,
                    scrollDirection = _a === void 0 ? this.DIRECTION_VERTICAL : _a;
                var _b = this.sizeAndPositionManager.getSizeAndPositionForIndex(index),
                    size = _b.size,
                    offset = _b.offset;
                return this.styleCache[index] = __assign({}, this.STYLE_ITEM, (_c = {}, _c[this.sizeProp[scrollDirection]] = size, _c[this.positionProp[scrollDirection]] = offset, _c));
                var _c;
            },
            assign(t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.rootNode = this.$el;
            this.$el.addEventListener('scroll', this.handleScroll)

            var _d = this.sizeAndPositionManager.getVisibleRange({
                containerSize: this.sizeProp[this.scrollDirection] || 0,
                offset: this.offset,
                overscanCount: this.overscanCount
            }),
                start = _d.start,
                stop = _d.stop,
                items = [];

            if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
                for (var index = start; index <= stop; index++) {
                    items.push(this.renderItem({
                        index: index,
                        style: this.getStyle(index)
                    }));
                }
                if (typeof this.onItemsRendered === 'function') {
                    this.onItemsRendered({
                        startIndex: start,
                        stopIndex: stop
                    });
                }
            }
        },
        created() {
            this.sizeAndPositionManager = new SizeAndPositionManager({
                itemCount: this.itemCount,
                itemSizeGetter: function (index) {
                    return this.getSize(index);
                },
                estimatedItemSize: this.getEstimatedItemSize()
            });

            this.offset = this.scrollOffset || this.scrollToIndex != null && this.getOffsetForIndex(this.scrollToIndex) || 0;
            this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;


            //Set default properties
            this.overscanCount = this.overscanCount ? this.overscanCount : this.defaultProps.overscanCount;
            this.scrollDirection = this.scrollDirection ? this.scrollDirection : this.defaultProps.DIRECTION_VERTICAL;
            this.width = this.width ? this.width : this.defaultProps.width;
        },
        beforeDestroy() {
            this.$el.removeEventListener('scroll', this.handleScroll);
            console.log('scrolling Destroyed');
        }
    }
</script>