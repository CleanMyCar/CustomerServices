'use strict';

const e = React.createElement;
const Grid = ReactVirtualized.Grid,
    defaultCellRangeRenderer = ReactVirtualized.defaultCellRangeRenderer,
    ScrollSync = ReactVirtualized.ScrollSync,
    List = ReactVirtualized.List;

import Moment from 'moment';

let data = null, dateHeaders = null;

class ReactGrid extends React.Component {
    constructor(props) {
        super(props);
        this.headerRenderer = this.headerRenderer.bind(this);
        this.cellRenderer = this.cellRenderer.bind(this);
        this.onScrollHeaderGrid = this.onScrollHeaderGrid.bind(this);
        this.onScrollGrid = this.onScrollGrid.bind(this);
        this.cellRangeRenderer = this.cellRangeRenderer.bind(this);
        this.unitPropertyNamesRenderer = this.unitPropertyNamesRenderer.bind(this);
        this.state = {
            data: data,
            headers: dateHeaders,
            resHeaders: ['StartDate', 'ConfirmationNumber', 'GuestName', 'Reservationstatus'],
            listData: [1, 2.3, 4, 5, 6, 7],
            gridProps: {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            },
            unitPropertyList: [
                {
                    UnitName: "Unit1",
                    PropertyName: "PR1",
                    UnitTypeName: "UT1"
                },
                {
                    UnitName: "Unit2",
                    PropertyName: "PR1",
                    UnitTypeName: "UT4"
                },
                {
                    UnitName: "Unit3",
                    PropertyName: "PR2",
                    UnitTypeName: "UT5"
                },
                {
                    UnitName: "Unit4",
                    PropertyName: "PR1",
                    UnitTypeName: "UT1"
                },
                {
                    UnitName: "Unit5",
                    PropertyName: "PR3",
                    UnitTypeName: "UT7"
                }                
            ]
        };
    }

    getColumnValue(rowIndex, columnIndex, key) {
        return this.state.data[rowIndex]["unitRates"][columnIndex]["Amount"];
    }

    headerRenderer({ columnIndex, key, rowIndex, style }) {
        //console.log(this.state);
        return (
            <div
                key={key}
                style={style}
            >
                {Moment(this.state.headers[columnIndex]).format('DD MMM')}
            </div>
        )
    }

    unitPropertyNamesRenderer({ columnIndex, key, rowIndex, style }) {

        return (
            <div key={key} style={style}>
                {this.state.unitPropertyList[rowIndex]["UnitName"]}
            </div>
        )
    }

    cellRenderer({ columnIndex, key, rowIndex, style }) {

        return (
            <div key={key} style={style}>
                {this.getColumnValue(rowIndex, columnIndex, key)}
            </div>
        )
    }

    cellRangeRenderer({
        cellCache,                    // Temporary cell cache used while scrolling
        cellRenderer,                 // Cell renderer prop supplied to Grid
        columnSizeAndPositionManager, // @see CellSizeAndPositionManager,
        columnStartIndex,             // Index of first column (inclusive) to render
        columnStopIndex,              // Index of last column (inclusive) to render
        horizontalOffsetAdjustment,   // Horizontal pixel offset (required for scaling)
        isScrolling,                  // The Grid is currently being scrolled
        rowSizeAndPositionManager,    // @see CellSizeAndPositionManager,
        rowStartIndex,                // Index of first row (inclusive) to render
        rowStopIndex,                 // Index of last row (inclusive) to render
        scrollLeft,                   // Current horizontal scroll offset of Grid
        scrollTop,                    // Current vertical scroll offset of Grid
        styleCache,                   // Temporary style (size & position) cache used while scrolling
        verticalOffsetAdjustment      // Vertical pixel offset (required for scaling)
    }) {
        const renderedCells = []

        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            // This contains :offset (top) and :size (height) information for the cell
            let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

            for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                // This contains :offset (left) and :size (width) information for the cell
                let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)

                // Be sure to adjust cell position in case the total set of cells is too large to be supported by the browser natively.
                // In this case, Grid will shift cells as a user scrolls to increase cell density.
                let left = columnDatum.offset + horizontalOffsetAdjustment
                let top = rowDatum.offset + verticalOffsetAdjustment

                // The rest of the information you need to render the cell are contained in the data.
                // Be sure to provide unique :key attributes.
                let key = `${rowIndex}-${columnIndex}`
                let height = rowDatum.size
                let width = columnDatum.size

                // Now render your cell and additional UI as you see fit.
                // Add all rendered children to the :renderedCells Array.

                renderedCells.push(
                    this.cellRenderer({
                        columnIndex: columnIndex,
                        key: key,
                        rowIndex: rowIndex,
                        style: {
                            height: height,
                            left: left,
                            position: "absolute",
                            top: top,
                            width: width
                        }
                    }
                    )
                );
            }
        }

        return renderedCells
    }

    onSectionRendered() {
        console.log("Section rendered");
    }

    onScrollGrid(props) {
        console.log(props);
        this.setState({
            gridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: props.scrollLeft,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });
    }

    onScrollHeaderGrid(props) {
        console.log(props);
        this.setState({
            gridProps: {
                clientHeight: props.clientHeight,
                clientWidth: props.clientWidth,
                scrollHeight: props.scrollHeight,
                scrollLeft: props.scrollLeft,
                scrollTop: props.scrollTop,
                scrollWidth: props.scrollWidth
            }
        });
    }

    scrollTopList() {

    }

    rowRenderer({
        key,         // Unique key within array of rows
        index,       // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible,   // This row is visible within the List (eg it is not an overscanned row)
        style        // Style object to be applied to row (to position it)
    }) {
        return (
            <div
                key={key}
                style={style}
            >
                {dateHeaders[index]}
            </div>
        )
    }

    render() {
        return <ScrollSync>
            {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
                <div className='RatesGrid'>
                    <div className='unitsList'>
                        {/* <Grid
                            cellRenderer={this.unitPropertyNamesRenderer}                            
                            columnCount={3}
                            columnWidth={150}
                            height={300}
                            rowCount={this.state.data.length}
                            rowHeight={30}
                            width={450}                            
                            {...this.state.gridProps}
                        /> */}
                    </div>
                    <div className='Table'>
                        <div className='LeftColumn'>
                            <Grid
                                cellRenderer={this.headerRenderer}
                                columnCount={this.state.headers.length}
                                columnWidth={150}
                                height={50}
                                rowCount={1}
                                rowHeight={30}
                                width={1800}
                                onScroll={this.onScrollHeaderGrid}
                                {...this.state.gridProps}
                            />
                        </div>
                        <div className='RightColumn'>
                            <Grid
                                cellRenderer={this.cellRenderer}
                                onSectionRendered={this.onSectionRendered}
                                columnCount={this.state.headers.length}
                                columnWidth={150}
                                height={300}
                                rowCount={this.state.data.length}
                                rowHeight={30}
                                width={1800}
                                onScroll={this.onScrollGrid}
                                cellRangeRenderer={this.cellRangeRenderer}
                                {...this.state.gridProps}
                            />
                        </div>
                    </div>
                </div>
            )}
        </ScrollSync>
    }
}

export default function reactGrid(el) {

    this.init = (_data, _dateHeaders, ratesCount) => {
        data = _data;
        dateHeaders = _dateHeaders;
        ReactDOM.render(e(ReactGrid), el);
    }

    this._init = (data, dateHeaders, ratesCount) => {
        //ReactDOM.render(e(LikeButton), el);

        this.state = {
            gridProps: {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            }
        };

        // Grid data as an array of arrays
        const list = data ? data : [
            ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */]
            // And so on...
        ],
            headers = dateHeaders,
            resHeaders = ['StartDate', 'ConfirmationNumber', 'GuestName', 'Reservationstatus'],
            listData = [1, 2.3, 4, 5, 6, 7],
            gridProps = {
                clientHeight: 100,
                clientWidth: 100,
                scrollHeight: 100,
                scrollLeft: null,
                scrollTop: null,
                scrollWidth: 100
            };




        function getColumnValue(columnIndex, key, rowIndex) {
            if (resHeaders[columnIndex] === "StartDate") {
                return Moment(list[rowIndex]["StartDate"]).format('DD MMM YYYY')
            }
            else {
                return list[rowIndex][resHeaders[columnIndex]]
            }
        }

        function headerRenderer({ columnIndex, key, rowIndex, style }) {
            return (
                <div
                    key={key}
                    style={style}
                >
                    {Moment(headers[columnIndex]).format('DD MMM')}
                </div>
            )
        }

        function cellRenderer({ columnIndex, key, rowIndex, style }) {

            // return (
            //     <div key={key} style={style}>
            //         {getColumnValue(columnIndex, key, rowIndex)}
            //     </div>
            // )

            return (
                <div key={key} style={style}>
                    {list[rowIndex]["unitRates"][columnIndex]["Amount"]}
                </div>
            )
        }

        function cellRangeRenderer(props) {
            const children = defaultCellRangeRenderer(props)
            children.push(
                <div>My custom overlay</div>
            )
            return children
        }

        function onSectionRendered() {
            console.log("Section rendered");
        }

        function onScrollGrid(props) {
            console.log(props);
            gridProps.clientHeight = props.clientHeight;
            gridProps.clientWidth = props.clientWidth;
            gridProps.scrollHeight = props.scrollHeight;
            gridProps.scrollLeft = props.scrollLeft;
            gridProps.scrollTop = props.scrollTop;
            gridProps.scrollWidth = props.scrollWidth;
        }

        function onScrollHeaderGrid(props) {
            console.log(props);
            gridProps.clientHeight = props.clientHeight;
            gridProps.clientWidth = props.clientWidth;
            gridProps.scrollHeight = props.scrollHeight;
            gridProps.scrollLeft = props.scrollLeft;
            gridProps.scrollTop = props.scrollTop;
            gridProps.scrollWidth = props.scrollWidth;
        }

        function scrollTopList() {

        }

        function rowRenderer({
            key,         // Unique key within array of rows
            index,       // Index of row within collection
            isScrolling, // The List is currently being scrolled
            isVisible,   // This row is visible within the List (eg it is not an overscanned row)
            style        // Style object to be applied to row (to position it)
        }) {
            return (
                <div
                    key={key}
                    style={style}
                >
                    {dateHeaders[index]}
                </div>
            )
        }

        // Render your grid
        ReactDOM.render(
            // <div>
            //     <div className='HeaderColumn'>
            //         <Grid
            //             cellRenderer={headerRenderer}
            //             columnCount={headers.length}
            //             columnWidth={150}
            //             height={50}
            //             rowCount={1}
            //             rowHeight={30}
            //             width={1800}
            //         />
            //     </div>
            //     <div className='GridData'>
            //         <Grid
            //             cellRenderer={cellRenderer}
            //             onSectionRendered={onSectionRendered}
            //             columnCount={headers.length}
            //             columnWidth={150}
            //             height={300}
            //             rowCount={ratesCount}
            //             rowHeight={30}
            //             width={1800}
            //         />
            //     </div>
            // </div>,
            <ScrollSync>
                {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
                    <div className='Table'>
                        <div className='LeftColumn'>
                            <Grid
                                cellRenderer={headerRenderer}
                                columnCount={headers.length}
                                columnWidth={150}
                                height={50}
                                rowCount={1}
                                rowHeight={30}
                                width={1800}
                                onScroll={onScrollHeaderGrid}
                                {...gridProps}
                            />
                        </div>
                        <div className='RightColumn'>
                            <Grid
                                cellRenderer={cellRenderer}
                                onSectionRendered={onSectionRendered}
                                columnCount={headers.length}
                                columnWidth={150}
                                height={300}
                                rowCount={data.length}
                                rowHeight={30}
                                width={1800}
                                onScroll={onScrollGrid}
                                {...gridProps}
                            />
                        </div>
                    </div>
                )}
            </ScrollSync>,
            el
        );
    };

    this.destroy = () => {

    }

    this.applyData = (data) => {

    };
}