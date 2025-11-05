/**
 * Token Icon Component
 * Displays token icons from assets folder
 */

import React from "react";
import ethIcon from "../assets/eth.png";
import usdcIcon from "../assets/usdc.png";
import usdtIcon from "../assets/usdt.svg";
import maticIcon from "../assets/matic.png";
import bnbIcon from "../assets/bnb.svg";
import chainlinkIcon from "../assets/chainlink.png";
import btcIcon from "../assets/btc.png";
import wbtcIcon from "../assets/wbtc.png";

interface TokenIconProps {
    symbol: string;
    size?: number;
    className?: string;
}

const TOKEN_ICONS: Record<string, string> = {
    ETH: ethIcon,
    USDC: usdcIcon,
    USDT: usdtIcon,
    MATIC: maticIcon,
    BNB: bnbIcon,
    LINK: chainlinkIcon,
    BTC: btcIcon,
    WBTC: wbtcIcon,
};

export const TokenIcon: React.FC<TokenIconProps> = ({
    symbol,
    size = 24,
    className = "",
}) => {
    const iconSrc = TOKEN_ICONS[symbol];

    if (!iconSrc) {
        // Fallback for tokens without icons
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white font-semibold ${className}`}
                style={{ width: size, height: size, borderRadius: "50%" }}
            >
                <span style={{ fontSize: size * 0.5 }}>
                    {symbol.charAt(0)}
                </span>
            </div>
        );
    }

    return (
        <img
            src={iconSrc}
            alt={`${symbol} icon`}
            className={`object-cover rounded-full ${className}`}
            style={{ width: size, height: size }}
        />
    );
};

