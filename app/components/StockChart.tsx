"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

type Props = {
    data: any[];
    support?: number;
    resistance?: number;
  };

export default function StockChart({ data, support, resistance }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#020617" },
        textColor: "#CBD5E1",
      },
      grid: {
        vertLines: { color: "#1E293B" },
        horzLines: { color: "#1E293B" },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#f43f5e",
      downColor: "#3b82f6",
      borderVisible: false,
      wickUpColor: "#f43f5e",
      wickDownColor: "#3b82f6",
    });

    candleSeries.setData(
      data.map((item) => ({
        time: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );

    const ma5Series = chart.addSeries(LineSeries, {
      color: "#34d399",
      lineWidth: 2,
    });

    ma5Series.setData(
      data
        .filter((item) => item.ma5)
        .map((item) => ({
          time: item.date,
          value: item.ma5,
        }))
    );

    const ma20Series = chart.addSeries(LineSeries, {
      color: "#38bdf8",
      lineWidth: 2,
    });

    ma20Series.setData(
      data
        .filter((item) => item.ma20)
        .map((item) => ({
          time: item.date,
          value: item.ma20,
        }))
    );

    if (support) {
        candleSeries.createPriceLine({
          price: support,
          color: "#38bdf8",
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: "지지선",
        });
      }
      
      if (resistance) {
        candleSeries.createPriceLine({
          price: resistance,
          color: "#f87171",
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: "저항선",
        });
      }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
}