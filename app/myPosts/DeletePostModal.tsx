"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";
import axios, { AxiosError } from "axios";

type DeletePostModalProps = {
    showModal: boolean
    setShowModal: (isOpen: boolean) => void
    postId: string
}

export default function DeletePostModal({ showModal, setShowModal, postId }: DeletePostModalProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async (id: string) => await axios.delete(`api/posts/deletePost/${id}`),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["my-posts"]);
                setShowModal(false);
                messageApi.open({ type: "success", content: "Post has been deleted!", key: "deletePost" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["my-posts"]);
                setShowModal(false);
                if (error instanceof AxiosError) {
                    messageApi.open({ type: "error", content: error?.response?.data.message, key: "deletePost" })
                }
            }
        }
    )
    const handleOk = () => {
        mutate(postId);
        messageApi.open({ type: "loading", content: "Deleting post...", key: "deletePost" })
    }
    const handleCancel = () => {
        setShowModal(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Delete Post"
                open={showModal}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{className: "bg-blue-500"}}
            >
                <p> Are you sure want to delete your post? </p>
            </Modal>
        </>
    )
}