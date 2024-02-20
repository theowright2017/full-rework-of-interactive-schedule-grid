
<br />
<div align="center" >
  

  <h3 align="center">Interactive Schedule Grid</h3>

  <p align="center">
    A full rework of the existing schedule grid.
    <br />
   
  </p>
</div>






<!-- ABOUT THE PROJECT -->
## About The Project


Our main product offering is the ability to modify schedules on the fly in an interactive and intuitive manner.  There is much scope to extend this functionality in the future.
The current schedule grid is an amalgamation of outdated / unmaintained libraries and code that is no longer readable or easily maintained / extended.

This project is a full rewrite and re-architecture based on the existing UI.









### Built With

This project is using the following technologies:


- Languages
  - <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">Javascript</a>
  - <a href="https://sass-lang.com/">SCSS</a>
- Frameworks
  - <a href="https://nextjs.org/">Next.js</a>
  - <a href="https://react.dev/">React</a>
- Libraries
  - <a href="https://virtuoso.dev/">React Virtuoso</a>
- Tools
  - <a href="https://www.typescriptlang.org/">Typescript</a>
  - <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table">HTML Table</a>
  


  
<!-- USAGE EXAMPLES -->
## Usage

- An interactive grid to plot items (Card) based on set parameters


- Requirements are as follows:
  - Plot items on a time day day based X and Y axis grid
  - Ablitity to resize / zoom in and out whilst maintaining visual integrity i.e all items remain in view, etc
  - User can interact with each card without causing any performance issues
  - Efficiently handle up to a maximum of around 2k items
  - Use existing time and slot based functionality as this is consistent throughout other areas of the app, relating to the same items
  - Items on grid need to place next to each other whenever possible.  If items overlap, place on new line

- Code behaviour and points to note:
  - In conjunction with new backend update will significantly reduce loading time as items will already be ordered by day due to new API params
  - React Virtuoso used instead of Tanstack Virtual
    - No requirement to transform individual rows therefore enabling amongst others, box-shadow on the cards
  - HTML Table used instead of Tanstack (React) Table
    - No need for table library in this instance, plus easier to work with for custom columns and rows
  - ScheduleGrid.tsx takes a config object, allowing updating size, visible times / days, etc on the fly, via the config display inputs
  - gridCoords.js plots the items on the grid
    - Can likely be improved with a more algorithmic approach
    - However, worth noting could potentially be improved with virtualisation and plotting items on render
    - Requires further discussion and investigation
  - Previous grid rendered a list of divs and then visually styled to look like rows, requiring a full refresh on each card interaction
    - As we are now using a HTML table, each 'row' has its own state.  User interactions with cards now only re-render the individual row
  - Drag and drop and other card / grid interactions can be easily added and functionality easily extended as required
   
  - Further revision is required to port into existing codebase.




<!-- GETTING STARTED -->

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.





 
