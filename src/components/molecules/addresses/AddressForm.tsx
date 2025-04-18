"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const addressSchema = z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zipCode: z.string().min(1, "CEP é obrigatório"),
    reference: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    userId: string;
    onSubmit: (data: AddressFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export function AddressForm({
    onSubmit,
    onCancel,
    isSubmitting = false,
}: AddressFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" placeholder="Rua Exemplo" {...register("street")} />
                    {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="number">Número</Label>
                    <Input id="number" placeholder="123" {...register("number")} />
                    {errors.number && <p className="text-sm text-destructive">{errors.number.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" placeholder="Apto, bloco..." {...register("complement")} />
                    {errors.complement && <p className="text-sm text-destructive">{errors.complement.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" placeholder="Centro" {...register("neighborhood")} />
                    {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="São Paulo" {...register("city")} />
                    {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" placeholder="SP" {...register("state")} />
                    {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input id="zipCode" placeholder="00000-000" {...register("zipCode")} />
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="reference">Referência</Label>
                    <Input id="reference" placeholder="Próximo ao MASP" {...register("reference")} />
                    {errors.reference && <p className="text-sm text-destructive">{errors.reference.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                    {isSubmitting ? "Salvando..." : "Salvar Endereço"}
                </Button>
            </div>
        </form>
    );
}
