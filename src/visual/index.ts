// interface Instruction {
//   label: string;
//   next: Instruction[];
// }
// interface Implementation extends  {}

import * as d3 from 'd3';

export function start({ code, input }: { code: string; input: string }): void {
  memory();
}

export function memory() {
  console.log('hi');

  const MAX_VALUE = 255;
  const ITEMS = 30000;
  const ROWS = Math.ceil(Math.sqrt(ITEMS));
  const SIZE = 1000;

  var margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = SIZE - margin.left - margin.right,
    height = SIZE - margin.top - margin.bottom;

  const svg = d3
    .select('#memory')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const xBand = d3
    .scaleBand()
    .range([0, width])
    .domain(
      Array(ROWS)
        .fill(0)
        .map((_, i) => String(i)),
    );

  svg
    .append('g')
    .style('font-size', 15)
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xBand).tickSize(0))
    .select('.domain')
    .remove();

  const yBand = d3
    .scaleBand()
    .range([height, 0])
    .domain(
      Array(ROWS)
        .fill(0)
        .map((_, i) => String(i)),
    );
  svg.append('g').style('font-size', 15).call(d3.axisLeft(yBand).tickSize(0)).select('.domain').remove();

  const fillForValue = d3.scaleSequential().interpolator(d3.interpolateRainbow).domain([1, MAX_VALUE]);

  const tooltip = d3
    .select('#memory')
    .append('div')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background-color', 'black');

  svg
    .selectAll()
    .data(
      Array(ITEMS)
        .fill(0)
        .map((_, index) => ({ index, value: index })),
    )
    .enter()
    .append('rect')
    .attr('x', ({ index }) => Number(xBand(String(index % ROWS))))
    .attr('y', ({ index }) => Number(xBand(String(Math.floor(index / ROWS)))))
    .attr('width', SIZE / ROWS)
    .attr('height', SIZE / ROWS)
    .style('fill', event => fillForValue(event.index))
    .on('mouseover', event => {
      tooltip.style('opacity', 1);
      d3.select(event.currentTarget).style('stroke', 'black');
    })
    .on('mousemove', (event, { index, value }) => {
      console.log(d3.pointer(event));
      tooltip
        .html(`memory[${index}] = ` + value)
        .style('left', d3.pointer(event)[0] + 500 + 'px')
        .style('top', d3.pointer(event)[1] + 500 + 'px');
    })
    .on('mouseleave', event => {
      tooltip.style('opacity', 0);
      d3.select(event.currentTarget).style('stroke', 'none');
    });

  svg
    .append('text')
    .attr('x', 0)
    .attr('y', -50)
    .attr('text-anchor', 'left')
    .style('font-size', '22px')
    .text('A d3.js heatmap');

  svg
    .append('text')
    .attr('text-anchor', 'left')
    .style('font-size', '14px')
    .style('fill', 'grey')
    .style('max-width', 400)
    .attr('y', -10)
    .text('Application memory');
}
