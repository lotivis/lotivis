

### Dataset Collection

A dataset collection is basically an array of datasets.



### Dataset

| Property | Use |
| ---- | ----- |
| label: String | The name of the dataset. When doing a diachronic or diatopic search this is the search word. |
| stack: String | The stack / group of the dataset. Useful to datasetCombine datasets when presented. |
| data: [Item] | The actual data of the dataset. |



### Data

Data is a collection of items.



### Item

| Property | Use |
| ---- | ----- |
| label: String | The name of the item. |
| value: Number \| Any | The value of the item. Will be a number most of the time but may be any type. |
| datum: Date \| Timestamp \| Number | The datum this item takes part. |
| datumTotal: Number \| Any \| null | The total amount of values in the datum. |
| location: String \| Identifier \| null | The location from which the item comes from. |
| locationTotal: Number \| Any \| null | The total amount of value in the location. |



### DatasetsController

| Property                          | Use                                             |
| --------------------------------- | ----------------------------------------------- |
| ```originalDatasets: [Dataset]``` | Reference to the original datasets collection.  |
| ```originalFlatData: [Item]```    | Reference to the original flat data collection. |
| ```datasets: [Dataset]```         | The working datasets.                           |
| ```flatData: [Item]```            | Flat collection of items of the datasets.       |



### Dataview

