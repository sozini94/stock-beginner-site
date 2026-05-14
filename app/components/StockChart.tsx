"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
} from "lightweight-charts";

type ChartItem = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma5?: number | null;
  ma20?: number | null;
};

type HoverData = {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
};

type Props = {
  data: ChartItem[];
  support?: number;
  resistance?: number;
};

export default function StockChart({ data, support, resistance }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [hoverData, setHoverData] = useState<HoverData | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 560,
      layout: {
        background: { color: "#020617" },
        textColor: "#CBD5E1",
      },
      grid: {
        vertLines: { color: "#1E293B" },
        horzLines: { color: "#1E293B" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
      },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#ef4444",
      downColor: "#3b82f6",
      borderVisible: false,
      wickUpColor: "#ef4444",
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
      color: "#22c55e",
      lineWidth: 2,
    });

    ma5Series.setData(
      data
        .filter((item) => item.ma5 !== null && item.ma5 !== undefined)
        .map((item) => ({
          time: item.date,
          value: Number(item.ma5),
        }))
    );

    const ma20Series = chart.addSeries(LineSeries, {
      color: "#38bdf8",
      lineWidth: 2,
    });

    ma20Series.setData(
      data
        .filter((item) => item.ma20 !== null && item.ma20 !== undefined)
        .map((item) => ({
          time: item.date,
          value: Number(item.ma20),
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

    chart.subscribeCrosshairMove((param) => {
      if (!param.time) return;

      const price = param.seriesData.get(candleSeries) as
        | {
            open: number;
            high: number;
            low: number;
            close: number;
          }
        | undefined;

      if (!price) return;

      setHoverData({
        time: String(param.time),
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
      });
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 0,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, support, resistance]);

  return (
    <div>
      {hoverData && (
        <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-900/80 p-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-slate-400">날짜</p>
            <p className="mt-1 font-semibold text-white">{hoverData.time}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">시가</p>
            <p className="mt-1 font-semibold text-yellow-300">
              {hoverData.open.toLocaleString()}원
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">고가</p>
            <p className="mt-1 font-semibold text-red-300">
              {hoverData.high.toLocaleString()}원
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">저가</p>
            <p className="mt-1 font-semibold text-sky-300">
              {hoverData.low.toLocaleString()}원
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">종가</p>
            <p className="mt-1 font-semibold text-emerald-300">
              {hoverData.close.toLocaleString()}원
            </p>
          </div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="h-[560px] w-full overflow-hidden rounded-2xl"
      />

      <div className="mt-4 rounded-2xl bg-slate-900/80 p-4 text-sm leading-6 text-slate-300">
        마우스를 차트 위에 올리면 해당 날짜의 시가, 고가, 저가, 종가를 볼 수
        있어요. 마우스 휠로 확대/축소할 수 있고, 드래그해서 이동도 가능합니다.
      </div>
    </div>
  );
}