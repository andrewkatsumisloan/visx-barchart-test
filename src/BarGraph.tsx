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
    dynamic_revenue: 1000,
    static_revenue: 2000, 
    year: '2021',
  }, {
    dynamic_revenue: 2000,
    static_revenue: 4000,
    year: '2022',
  }, {
    dynamic_revenue: 4000,
    static_revenue: 8000,
    year: '2023',
  }, {
    dynamic_revenue: 8000,
    static_revenue: 16000,
    year: '2024',
  }, {
    dynamic_revenue: 16000, 
    static_revenue: 32000,
    year: '2025'
  }];

  const data1 = dummyData.slice(0, 5);
  const keys1 = Object.keys(data1[0]).filter((d) => d !== 'year');
  const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

  const formatDate = (date: string) => date;
  console.log(keys1)

  const getYear = (d: static_revenue) => d.year;
  const getDynamicRevenue = (d: static_revenue) => d.dynamic_revenue;

  const dateScale = scaleBand<string>({
    domain: data1.map(getYear),
    padding: 0.2,
  });

  const valueScale = scaleBand<string>({
    domain: data1.map(getDynamicRevenue),
    padding: 0.2,
  });

  const colorScale = scaleOrdinal<string, string>({
    domain: keys1,
    range: [blue, green, purple],
  }); 

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
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
          x0Scale={dateScale}
          x1Scale={dateScale}
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
        scale={dateScale}
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

