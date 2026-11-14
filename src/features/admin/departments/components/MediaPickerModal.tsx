"use client";

import {
  UnifiedMediaPickerModal,
  type MediaAssetItem,
} from "@/features/admin/media/components/UnifiedMediaPickerModal";

export { type MediaAssetItem };

export interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, altText?: string) => void;
  mediaAssets?: MediaAssetItem[];
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mediaAssets = [],
}: MediaPickerModalProps) {
  return (
    <UnifiedMediaPickerModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={(url, alt) => onSelect(url, alt)}
      initialAssets={mediaAssets}
    />
  );
}
