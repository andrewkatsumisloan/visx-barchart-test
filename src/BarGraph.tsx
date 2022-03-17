import React from 'react'
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';

export type BarGroupProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
};

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

export default function BarGraph({
  width,
  height,
  events = false,
  margin = defaultMargin,
}: BarGroupProps) {
  const purple = '#9caff6';
  const background = '#612efb';
  const blue = '#aeeef8';
  const green = '#e5fd3d';
  const dummyData = [{
    dynamic_revenue: 500,
    static_revenue: 1000,
    year: '2020',
  }, {
    dynamic_revenue: 100,
    static_revenue: 2000, 
    year: '2021',
  }, {
    dynamic_revenue: 2500,
    static_revenue: 1500,
    year: '2022',
  }, {
    dynamic_revenue: 2500,
    static_revenue: 2800,
    year: '2023',
  }, {
    dynamic_revenue: 800,
    static_revenue: 1600,
    year: '2024',
  }, {
    dynamic_revenue: 2200, 
    static_revenue: 1200,
    year: '2025'
  }];

  const data1 = dummyData;

  const keys1 = Object.keys(data1[0]).filter((d) => d !== 'year');
  const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

  const formatDate = (date: string) => date;
  console.log(keys1)

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;


  const getYear = (d: static_revenue) => d.year;

  const paramScale = scaleBand<string>({
    domain: keys1,
    padding: 0.1,
  });

  const yearScale = scaleBand<string>({
    domain: data1.map(getYear),
    padding: 0.2,
  });

  const valueScale = scaleLinear<number>({
     domain: [0, Math.max(...data1.map((d) => Math.max(...keys1.map((key) => Number(d[key])))))],
  });

  const colorScale = scaleOrdinal<string, string>({
    domain: keys1,
    range: [blue, green, purple],
  }); 

  // update scale output dimensions
  yearScale.rangeRound([0, xMax]);
  paramScale.rangeRound([0, yearScale.bandwidth()]);
  valueScale.rangeRound([yMax, 0])

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroup
          data={data1}
          keys={keys1}
          height={yMax}
          x0={getYear}
          x1={getYear}
          x0Scale={yearScale}
          x1Scale={paramScale}
          yScale={valueScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                    onClick={() => {
                      if (!events) return;
                      const { key, value } = bar;
                      alert(JSON.stringify({ key, value }));
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        tickFormat={formatDate}
        scale={yearScale}
        stroke={green}
        tickStroke={green}
        hideAxisLine
        tickLabelProps={() => ({
          fill: green,
          fontSize: 11,
          textAnchor: 'middle',
        })}
      />
    </svg>
  )
}

