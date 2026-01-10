import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompetitorService } from '../../services/competitor.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormField, MatLabel } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-competitor-form',
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormField,
    MatLabel,
    CommonModule,
    MatInputModule,
  ],
  templateUrl: './competitor-form.html',
  styleUrl: './competitor-form.scss',
})
export class CompetitorForm {
  @Output() submitForm = new EventEmitter<FormGroup>();

  competitorFormGroup: FormGroup;
  competitorId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private competitorService: CompetitorService,
  ) {
    this.competitorFormGroup = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(35)]],
    });
  }

  ngOnInit() {
    const routerId = this?.route?.snapshot?.paramMap?.get('id');
    if (routerId) {
      this.competitorId = Number(routerId);
    }

    if (this.competitorId) {
      this.competitorService.getCompetitorInfoById(this.competitorId).subscribe((user) => {
        this.competitorFormGroup.patchValue({
          id: user.id,
          name: user.name,
        });
      });
    }
  }

  get name() {
    return this.competitorFormGroup.get('name')!;
  }
}
