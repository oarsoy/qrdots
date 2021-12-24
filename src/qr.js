import QRCodeUtil from "qrcode";
import React, { useMemo } from "react";

const generateMatrix = (value, errorCorrectionLevel) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );
};

const QRCode = ({
  ecl = "M",
  logo,
  logoBackgroundColor: givenLogoBackgroundColor,
  logoMargin = 5,
  logoSize = 34,
  size = 150,
  value = "QR Code",
  randomDotSize = false
}) => {
  const logoBackgroundColor = givenLogoBackgroundColor;
  const href = logo;
  const dots = useMemo(() => {
    const dots = [];
    const matrix = generateMatrix(value, ecl);
    const cellSize = size / matrix.length;
    let qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ];

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        dots.push(
          <rect
            fill={i % 2 !== 0 ? "white" : "black"}
            height={cellSize * (7 - i * 2)}
            rx={(i - 3) * -10 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            ry={(i - 3) * -10 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            width={cellSize * (7 - i * 2)}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
          />
        );
      }
    });

    const clearArenaSize = Math.floor((logoSize * 1.5 + 3) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        if (matrix[i][j]) {
          if (
            !(
              (i < 7 && j < 7) ||
              (i > matrix.length - 8 && j < 7) ||
              (i < 7 && j > matrix.length - 8)
            )
          ) {
            if (
              !(
                i > matrixMiddleStart &&
                i < matrixMiddleEnd &&
                j > matrixMiddleStart &&
                j < matrixMiddleEnd &&
                i < j + clearArenaSize / 2 &&
                j < i + clearArenaSize / 2 + 1
              )
            ) {
              dots.push(
                <circle
                  cx={i * cellSize + cellSize / 2}
                  cy={j * cellSize + cellSize / 2}
                  fill="black"
                  r={cellSize / (randomDotSize ? (Math.random() + 1) * 2 : 2.8)} // calculate size of single dots
                />
              );
            }
          }
        }
      });
    });

    return dots;
  }, [ecl, logoSize, size, value, randomDotSize]);

  const logoPosition = size / 2 - logoSize / 2 - logoMargin;
  const logoWrapperSize = logoSize + logoMargin * 2;

  return (
    <svg height={size / 2} width={size / 2} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id="clip-wrapper">
          <rect height={logoWrapperSize} width={logoWrapperSize} />
        </clipPath>
        <clipPath id="clip-logo">
          <rect height={logoSize} width={logoSize} />
        </clipPath>
      </defs>
      <rect fill="white" height={size} width={size} />
      {dots}
      {logo && (
        <g>
          <rect
            //clipPath="url(#clip-wrapper)"
            fill={logoBackgroundColor}
            height={logoWrapperSize}
            width={logoWrapperSize}
            x={logoPosition}
            y={logoPosition}
          />
          <g>
            <image
              //clipPath="url(#clip-logo)"
              height={logoSize}
              href={href}
              preserveAspectRatio="xMidYMid slice"
              width={logoSize}
              x={logoPosition + logoMargin}
              y={logoPosition + logoMargin}
            />
          </g>
        </g>
      )}
    </svg>
  );
};

export default QRCode;
