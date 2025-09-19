import { Tooltip } from "antd";
import { BiPencil, BiTrash } from "react-icons/bi";

export function EditButton({ onClick }: { onClick?: () => any }) {
    return (
        <Tooltip title="แก้ไข" color="#FF9E00">
            <button
                onClick={onClick}
                className="max-w-8 max-h-8 aspect-square"
            // sx={{
            //     minWidth: "32px",
            //     minHeight: "32px",
            //     backgroundColor: "#FF9E0033",
            //     padding: "6px",
            //     ":hover": { backgroundColor: "#FF9E0040", color: "#FF9E00" },
            // }}
            >
                <BiPencil size={18} color="#FF9E00" />
            </button>
        </Tooltip>
    );
}

export function DeleteButton({ onClick }: { onClick?: () => any }) {
    return (
        <Tooltip title="ลบ" color="#EE6A4A">
            <button
                onClick={onClick}
                className="max-w-8 max-h-8 aspect-square"
            // sx={{
            //     minWidth: "32px",
            //     minHeight: "32px",
            //     backgroundColor: "#EE6A4A1A",
            //     padding: "6px",
            //     ":hover": {
            //         backgroundColor: "#EE6A4A40",
            //         color: "#EE6A4A",
            //     },
            // }}
            >
                <BiTrash size={18} color="#EE6A4A" />
            </button>
        </Tooltip>
    );
}