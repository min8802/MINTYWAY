import { IconButton, Link } from "@chakra-ui/react";
import React, { MouseEvent } from "react";
import {
  TbCopy,
  TbExternalLink,
  TbBrandGithub,
  TbBrandX,
  TbBrandTelegram,
  TbBrandDiscord,
  TbFile,
  TbLink,
  TbArrowBigRight,
} from "react-icons/tb";

interface CopyAddressButtonProps {
  address: string;
  size: string;
  onCopy: (address: string) => void;
}

interface ExternalLinkButtonProps {
  href: string;
  size: string;
}

export const CopyAddressButton: React.FC<CopyAddressButtonProps> = ({
  address,
  size,
  onCopy,
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onCopy(address);
  };

  return (
    <IconButton
      size={size}
      colorScheme="teal"
      variant="ghost"
      aria-label="Copy Address"
      borderColor="teal"
      border="1px"
      icon={<TbCopy size="20px" />}
      onClick={handleClick}
    />
  );
};

export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <Link
      href={`https://arbiscan.io/token/${href}`}
      isExternal
      onClick={handleClick}
    >
      <IconButton
        aria-label="Open Link"
        icon={<TbExternalLink size="20px" />}
        variant="ghost"
        borderColor="teal"
        border="1px"
        size={size}
        colorScheme="teal"
      />
    </Link>
  );
};

export const ExternalGithubButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open Github"
      icon={<TbBrandGithub size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalXButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open X"
      icon={<TbBrandX size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalTelegramButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open Telegram"
      icon={<TbBrandTelegram size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalDiscordButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open Discord"
      icon={<TbBrandDiscord size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalWhitepaperButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open Whitepaper"
      icon={<TbFile size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalWebsiterButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href} isExternal>
    <IconButton
      aria-label="Open Website"
      icon={<TbLink size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);

export const ExternalRightArrowButton: React.FC<ExternalLinkButtonProps> = ({
  href,
  size,
}) => (
  <Link href={href}>
    <IconButton
      aria-label="Open Website"
      icon={<TbArrowBigRight size="20px" />}
      variant="ghost"
      borderColor="teal"
      border="1px"
      size={size}
      colorScheme="teal"
    />
  </Link>
);
