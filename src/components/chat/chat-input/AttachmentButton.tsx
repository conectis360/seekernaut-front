import React, { useRef, ChangeEvent, ReactNode } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface AttachmentButtonProps {
  onChange: (files: FileList | null) => void;
  children?: ReactNode; // Para permitir um ícone customizado
  multiple?: boolean;
  accept?: string; // Tipos de arquivo aceitos (ex: 'image/*,application/pdf')
  ariaLabel?: string;
  fontSize?: string | number;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({
  onChange,
  children = <AttachFileIcon />,
  multiple = false,
  accept,
  ariaLabel = "adicionar anexo",
  fontSize,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files);
    if (event.target.value) {
      event.target.value = "";
    }
  };

  return (
    <>
      <IconButton
        disableRipple
        color="default"
        onClick={handleClick}
        sx={{
          color: "#f5f5f5",
          display: "flex", // Usamos Flexbox para alinhar os itens
          alignItems: "center", // Alinha verticalmente ao centro
          gap: 1, // Adiciona um pequeno espaço entre o ícone e o texto
          "& p": {
            fontSize: fontSize,
            margin: 0, // Remove a margem padrão do parágrafo
          },
        }}
        aria-label={ariaLabel}
      >
        {children}
        <Typography variant="body2" sx={{ fontSize: fontSize }}>
          {ariaLabel}
        </Typography>
      </IconButton>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
      />
    </>
  );
};

export default AttachmentButton;
