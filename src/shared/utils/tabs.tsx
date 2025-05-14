import { FiUser, FiUsers } from "react-icons/fi";
import { FaDollarSign } from "react-icons/fa6";
import { LuPercent } from "react-icons/lu";
import { GrBook } from "react-icons/gr";
import React from "react";
import { Progress } from "../icons/Progress";
import { useTranslation } from "react-i18next";

import hyperliquid from "../../../public/assets/landing/hyperliquid.png";
import starknet from "../../../public/assets/landing/starknet.png";
import pudgyPenguins from "../../../public/assets/landing/pudgy-penguins.jpeg";
import wormhole from "../../../public/assets/landing/wormhole.png";
import jupiter from "../../../public/assets/landing/jupiter.png";
import uxlink from "../../../public/assets/landing/uxlink.png";
import blast from "../../../public/assets/landing/blast.png";
import magicEden from "../../../public/assets/landing/magic-eden.png";
import suilend from "../../../public/assets/landing/suilend.png";
import xion from "../../../public/assets/landing/xion.png";
import memefi from "../../../public/assets/landing/memefi.png";
import layerZero from "../../../public/assets/landing/layer-zero.png";

export const tabs = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  return [
    { name: t("tabs.profile"), href: "/profile", icon: <FiUser size={24} /> },
    {
      name: t("tabs.subscriptions"),
      href: "/subscriptions",
      icon: <FaDollarSign size={24} />,
    },
    {
      name: t("tabs.subaccounts"),
      href: "/subaccounts",
      icon: <FiUsers size={24} />,
    },
    {
      name: t("tabs.progress"),
      href: "/progress",
      icon: <Progress size={24} color="#8E8E8E" />,
    },
    {
      name: t("tabs.referal"),
      href: "/referal",
      icon: <LuPercent size={24} />,
    },
    {
      name: t("tabs.guides"),
      href: "/suggest-guide",
      icon: <GrBook size={24} />,
    },
  ];
};

export const subaccountTabs = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  return [
    {
      name: t("subaccountTabs.profile"),
      href: "/profile",
      icon: <FiUser size={24} />,
    },
    {
      name: t("subaccountTabs.guides"),
      href: "/suggest-guide",
      icon: <GrBook size={24} />,
    },
  ];
};

export const landingBlocks = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation();

  return [
    {
      id: 1,
      name: "Hyperliquid (HYPE)",
      image: hyperliquid,
      date: t("landingBlocks.hyperliquid.date"),
      average: t("landingBlocks.hyperliquid.average"),
      result: t("landingBlocks.hyperliquid.result"),
    },
    {
      id: 2,
      name: "Starknet (STRK)",
      image: starknet,
      date: t("landingBlocks.starknet.date"),
      average: t("landingBlocks.starknet.average"),
      result: t("landingBlocks.starknet.result"),
    },
    {
      id: 3,
      name: "Pudgy Penguins (PENGU)",
      image: pudgyPenguins,
      date: t("landingBlocks.pudgyPenguins.date"),
      average: t("landingBlocks.pudgyPenguins.average"),
      result: t("landingBlocks.pudgyPenguins.result"),
    },
    {
      id: 4,
      name: "Wormhole (W)",
      image: wormhole,
      date: t("landingBlocks.wormhole.date"),
      average: t("landingBlocks.wormhole.average"),
      result: t("landingBlocks.wormhole.result"),
    },
    {
      id: 5,
      name: "Jupiter (JUP)",
      image: jupiter,
      date: t("landingBlocks.jupiter.date"),
      average: t("landingBlocks.jupiter.average"),
      result: t("landingBlocks.jupiter.result"),
    },
    {
      id: 6,
      name: "UXLINK",
      image: uxlink,
      date: t("landingBlocks.uxlink.date"),
      average: t("landingBlocks.uxlink.average"),
    },
    {
      id: 7,
      name: "Blast (BLAST)",
      image: blast,
      date: t("landingBlocks.blast.date"),
      average: t("landingBlocks.blast.average"),
      result: t("landingBlocks.blast.result"),
    },
    {
      id: 8,
      name: "Magic Eden (ME)",
      image: magicEden,
      date: t("landingBlocks.magicEden.date"),
      average: t("landingBlocks.magicEden.average"),
    },
    {
      id: 9,
      name: "Suilend (SEND)",
      image: suilend,
      date: t("landingBlocks.suilend.date"),
      average: t("landingBlocks.suilend.average"),
    },
    {
      id: 10,
      name: "XION",
      image: xion,
      date: t("landingBlocks.xion.date"),
      average: t("landingBlocks.xion.average"),
    },
    {
      id: 11,
      name: "MemeFi (MEMEFI)",
      image: memefi,
      date: t("landingBlocks.memefi.date"),
      average: t("landingBlocks.memefi.average"),
    },
    {
      id: 12,
      name: "LayerZero (ZRO)",
      image: layerZero,
      date: t("landingBlocks.layerZero.date"),
      average: t("landingBlocks.layerZero.average"),
    },
  ];
};
