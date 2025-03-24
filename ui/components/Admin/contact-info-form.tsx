"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { createSupabaseClient, type ContactInfo } from "@/lib/supabase-client";
import { Button } from "@/ui/design-system/Button/button";
import { Input } from "@/ui/design-system/Input/input";
import { Label } from "@/ui/design-system/Label/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/design-system/Card/card";
import { MoveUp, MoveDown, Save } from 'lucide-react';

export function ContactInfoForm() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  async function fetchContactInfo() {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("contact_info").select("*").order("position", { ascending: true });

      if (error) throw error;

      setContactInfo(data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des informations de contact:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (id: string, field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    try {
      const currentIndex = contactInfo.findIndex((item) => item.id === id);
      if (currentIndex === -1) return;

      // Si on essaie de monter le premier élément ou descendre le dernier, ne rien faire
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === contactInfo.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const currentItem = contactInfo[currentIndex];
      const swapItem = contactInfo[swapIndex];

      // Échanger les positions
      const { error: error1 } = await supabase
        .from("contact_info")
        .update({ position: swapItem.position })
        .eq("id", currentItem.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from("contact_info")
        .update({ position: currentItem.position })
        .eq("id", swapItem.id);

      if (error2) throw error2;

      // Mettre à jour la liste
      fetchContactInfo();
    } catch (err) {
      console.error("Erreur lors du déplacement:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Mettre à jour chaque élément
      for (const item of contactInfo) {
        const { error } = await supabase
          .from("contact_info")
          .update({
            label: item.label,
            value: item.value,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (error) throw error;
      }

      setSuccess("Informations de contact mises à jour avec succès");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des informations de contact...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de contact</CardTitle>
        <CardDescription>Modifiez les informations de contact affichées sur votre site</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {contactInfo.map((item) => (
            <div key={item.id} className="space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <Label htmlFor={`label-${item.id}`}>Libellé</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => handleMove(item.id, "up")}>
                    <MoveUp className="h-4 w-4" />
                    <span className="sr-only">Monter</span>
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => handleMove(item.id, "down")}>
                    <MoveDown className="h-4 w-4" />
                    <span className="sr-only">Descendre</span>
                  </Button>
                </div>
              </div>
              <Input
                id={`label-${item.id}`}
                value={item.label}
                onChange={(e) => handleChange(item.id, "label", e.target.value)}
                required
              />

              <Label htmlFor={`value-${item.id}`}>Valeur</Label>
              <Input
                id={`value-${item.id}`}
                value={item.value}
                onChange={(e) => handleChange(item.id, "value", e.target.value)}
                required
              />
            </div>
          ))}

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={saving} className="ml-auto">
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            {!saving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}