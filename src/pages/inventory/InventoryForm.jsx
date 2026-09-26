import { useState } from "react";
import {
    addInventory,
    updateInventory
} from "../../services/departmentService";

const InventoryForm = ({
    serviceId,
    inventory,
    onSuccess,
    onCancel
}) => {

    const isEdit = !!inventory;

    const [form, setForm] = useState({
        name: inventory?.name || "",
        fee: inventory?.fee ?? "",
        stock: inventory?.stock ?? ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const payload = {
                name: form.name,
                fee: Number(form.fee),
                stock: Number(form.stock)
            };

            if (isEdit) {

                await updateInventory(
                    inventory.id,
                    payload
                );

            } else {

                await addInventory(
                    serviceId,
                    payload
                );
            }

            onSuccess();

        } catch (err) {

            console.error(
                "Inventory save error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to save inventory."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="inventory-form">

            <h4>
                {isEdit
                    ? "Update Inventory"
                    : "Add Inventory"}
            </h4>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="mb-3">

                <label className="form-label">
                    Inventory Name
                </label>

                <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter inventory name"
                />

            </div>

            <div className="mb-3">

                <label className="form-label">
                    Fee
                </label>

                <input
                    type="number"
                    name="fee"
                    className="form-control"
                    value={form.fee}
                    onChange={handleChange}
                    placeholder="Enter fee"
                />

            </div>

            <div className="mb-3">

                <label className="form-label">
                    Stock
                </label>

                <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                    min="0"
                />

            </div>

            <div className="d-flex gap-2">

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : isEdit
                            ? "Update Inventory"
                            : "Add Inventory"}
                </button>

            </div>

        </div>
    );
};

export default InventoryForm;