'use strict';

const e = React.createElement;
const Grid = ReactVirtualized.Grid,
    defaultCellRangeRenderer = ReactVirtualized.defaultCellRangeRenderer,
    ScrollSync = ReactVirtualized.ScrollSync,
    List = ReactVirtualized.List;

import Moment from 'moment';


class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return 'You liked this.';
        }

        return e(
            'button',
            { onClick: () => this.setState({ liked: true }) },
            'Like'
        );
    }
}

export default function reactGrid(el) {



    this.init = (data, dateHeaders) => {
        //ReactDOM.render(e(LikeButton), el);

        // Grid data as an array of arrays
        const list = data ? data : [
            ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 /* ... */]
            // And so on...
        ],
            headers = dateHeaders,
            resHeaders = ['StartDate', 'ConfirmationNumber', 'GuestName', 'Reservationstatus'],
            listData = [1, 2.3, 4, 5, 6, 7];


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
                    {resHeaders[columnIndex]}
                </div>
            )
        }

        function cellRenderer({ columnIndex, key, rowIndex, style }) {

            return (
                <div key={key} style={style}>
                    {getColumnValue(columnIndex, key, rowIndex)}
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

        function onScrollGrid() {

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
            <div>
                <div className='HeaderColumn'>
                    <Grid
                        cellRenderer={headerRenderer}
                        columnCount={4}
                        columnWidth={200}
                        height={30}
                        rowCount={1}
                        rowHeight={30}
                        width={800}
                    />
                </div>
                <div className='GridData'>
                    <Grid
                        cellRenderer={cellRenderer}
                        onSectionRendered={onSectionRendered}
                        columnCount={4}
                        columnWidth={200}
                        height={300}
                        rowCount={list.length}
                        rowHeight={30}
                        width={800}
                    />
                </div>
            </div>,
            // <ScrollSync>
            //     {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
            //         <div className='Table'>
            //             <div className='LeftColumn'>
            //                 <List
            //                     scrollTop={scrollTopList}                                  
            //                     rowCount={dateHeaders.length}                                
            //                     rowRenderer={rowRenderer}                              
            //                 />
            //             </div>
            //             <div className='RightColumn'>
            //              <Grid
            //                 cellRenderer={cellRenderer}
            //                 onSectionRendered={onSectionRendered}
            //                 columnCount={5}
            //                 columnWidth={100}
            //                 height={300}
            //                 rowCount={list.length}
            //                 rowHeight={30}
            //                 width={300}
            //                 onScroll={onScrollGrid}
            //             />
            //             </div>
            //         </div>
            //     )}
            // </ScrollSync>,
            el
        );
    };

    this.destroy = () => {

    }

    this.applyData = (data) => {

    };
}