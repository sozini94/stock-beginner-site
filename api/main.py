from datetime import datetime, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pykrx import stock

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://stock-beginner-site-ejvk.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TICKERS = {
    "360750": "TIGER 미국S&P500",
    "005930": "삼성전자",
    "000660": "SK하이닉스",
}


def to_number(value):
    try:
        return float(value)
    except Exception:
        return None


@app.get("/api/stocks")
def get_stocks():
    result = []

    for ticker in TICKERS.keys():
        result.append(analyze_stock(ticker))

    return result
def analyze_stock(ticker):
    name = TICKERS[ticker]

    end = datetime.today()
    start = end - timedelta(days=120)

    start_date = start.strftime("%Y%m%d")
    end_date = end.strftime("%Y%m%d")

    df = stock.get_market_ohlcv_by_date(start_date, end_date, ticker)

    df = df.reset_index()

    df["MA5"] = df["종가"].rolling(window=5).mean()
    df["MA20"] = df["종가"].rolling(window=20).mean()

    latest = df.iloc[-1]
    previous = df.iloc[-2]
    recent3 = df.tail(3)

    close = float(latest["종가"])
    prev_close = float(previous["종가"])

    ma5 = float(latest["MA5"])
    ma20 = float(latest["MA20"])

    recent_60 = df.tail(60)

    resistance = float(recent_60["고가"].max())
    support = float(recent_60["저가"].min())

    distance_to_resistance = ((resistance - close) / close) * 100
    distance_to_support = ((close - support) / close) * 100

    if distance_to_resistance <= 2:
        support_resistance_analysis = (
            "현재가는 최근 저항선에 가까워요. 이미 많이 오른 구간일 수 있어 단기 조정 가능성도 함께 봐야 해요."
        )
    elif distance_to_support <= 2:
        support_resistance_analysis = (
            "현재가는 최근 지지선에 가까워요. 가격이 이 구간에서 버티는지 확인하면 좋아요."
        )
    else:
        support_resistance_analysis = (
            "현재가는 지지선과 저항선 사이에 있어요. 위로는 저항선 돌파 여부, 아래로는 지지선 이탈 여부를 보면 좋아요."
        )

    change = close - prev_close
    change_rate = (change / prev_close) * 100

    if close > ma5 > ma20:
        trend = "상승 추세"
        summary = "5일선과 20일선 위에 있어 상승 흐름이 강한 상태예요."
    elif close < ma5 < ma20:
        trend = "하락 추세"
        summary = "이동평균선 아래에 있어 약세 흐름으로 볼 수 있어요."
    else:
        trend = "혼조 구간"
        summary = "방향성이 뚜렷하지 않은 구간이에요."

    # 최근 캔들 분석
    recent_candles = []

    for _, row in recent3.iterrows():
        if row["종가"] > row["시가"]:
            recent_candles.append("양봉")
        else:
            recent_candles.append("음봉")

    if recent_candles.count("양봉") >= 3:
        candle_analysis = (
            "최근 양봉이 연속으로 나오고 있어 매수세가 강한 흐름으로 볼 수 있어요."
        )
    elif recent_candles.count("음봉") >= 3:
        candle_analysis = (
            "최근 음봉이 이어지고 있어 단기적으로 매도 압력이 강한 상태예요."
        )
    else:
        candle_analysis = (
            "양봉과 음봉이 혼합되어 있어 방향성이 강하지 않은 흐름이에요."
        )

    # 몸통 크기 분석
    latest_body = abs(latest["종가"] - latest["시가"])
    previous_body = abs(previous["종가"] - previous["시가"])

    if latest_body > previous_body * 1.3:
        candle_analysis += " 최근 캔들 몸통이 커지면서 변동성과 추세 힘이 강해지고 있어요."

    chart_data = []

    for _, row in df.tail(60).iterrows():
        chart_data.append({
            "date": row["날짜"].strftime("%Y-%m-%d"),
            "open": int(row["시가"]),
            "high": int(row["고가"]),
            "low": int(row["저가"]),
            "close": int(row["종가"]),
            "ma5": None if row["MA5"] != row["MA5"] else round(float(row["MA5"]), 2),
            "ma20": None if row["MA20"] != row["MA20"] else round(float(row["MA20"]), 2),
        })

    return {
        "name": name,
        "ticker": ticker,
        "close": int(close),
        "change": int(change),
        "changeRate": round(change_rate, 2),
        "ma5": round(ma5, 2),
        "ma20": round(ma20, 2),
        "trend": trend,
        "summary": summary,
        "candleAnalysis": candle_analysis,
        "chartData": chart_data,
        "support": int(support),
        "resistance": int(resistance),
        "distanceToSupport": round(distance_to_support, 2),
        "distanceToResistance": round(distance_to_resistance, 2),
        "supportResistanceAnalysis": support_resistance_analysis,
    }
def get_etf_analysis():
    end = datetime.today()
    start = end - timedelta(days=120)

    start_date = start.strftime("%Y%m%d")
    end_date = end.strftime("%Y%m%d")

    df = stock.get_market_ohlcv_by_date(start_date, end_date, TICKER)

    if df.empty:
        return {
            "name": NAME,
            "ticker": TICKER,
            "error": "데이터를 가져오지 못했습니다.",
        }

    df = df.reset_index()
    df["MA5"] = df["종가"].rolling(window=5).mean()
    df["MA20"] = df["종가"].rolling(window=20).mean()

    latest = df.iloc[-1]
    previous = df.iloc[-2]

    close = to_number(latest["종가"])
    prev_close = to_number(previous["종가"])
    ma5 = to_number(latest["MA5"])
    ma20 = to_number(latest["MA20"])

    change = close - prev_close
    change_rate = (change / prev_close) * 100

    high_120 = to_number(df["고가"].max())
    low_120 = to_number(df["저가"].min())

    high_position = ((close - low_120) / (high_120 - low_120)) * 100

    if close > ma5 > ma20:
        trend = "상승 추세"
        summary = "현재 가격이 5일선과 20일선 위에 있어 단기 흐름이 강한 편이에요."
    elif close < ma5 < ma20:
        trend = "하락 추세"
        summary = "현재 가격이 5일선과 20일선 아래에 있어 단기 흐름이 약한 편이에요."
    else:
        trend = "혼조 구간"
        summary = "이동평균선이 엇갈려 있어서 방향성이 뚜렷하지 않은 구간이에요."

    if high_position >= 85:
        position_text = "최근 고점 근처"
        caution = "이미 많이 오른 구간일 수 있어 한 번에 매수하기보다 분할 접근이 좋아요."
    elif high_position <= 25:
        position_text = "최근 저점 근처"
        caution = "가격 부담은 낮아졌지만 하락 추세가 이어지는지 확인이 필요해요."
    else:
        position_text = "중간 가격대"
        caution = "고점과 저점 사이에 있어 추세 확인이 중요해요."

    chart_data = []
    for _, row in df.tail(60).iterrows():
        chart_data.append({
            "date": row["날짜"].strftime("%Y-%m-%d"),
            "open": int(row["시가"]),
            "high": int(row["고가"]),
            "low": int(row["저가"]),
            "close": int(row["종가"]),
            "volume": int(row["거래량"]),
            "ma5": None if row["MA5"] != row["MA5"] else round(float(row["MA5"]), 2),
            "ma20": None if row["MA20"] != row["MA20"] else round(float(row["MA20"]), 2),
        })

    return {
        "name": NAME,
        "ticker": TICKER,
        "close": int(close),
        "change": int(change),
        "changeRate": round(change_rate, 2),
        "ma5": round(ma5, 2),
        "ma20": round(ma20, 2),
        "high120": int(high_120),
        "low120": int(low_120),
        "positionPercent": round(high_position, 1),
        "trend": trend,
        "positionText": position_text,
        "summary": summary,
        "caution": caution,
        "chartData": chart_data,
    }