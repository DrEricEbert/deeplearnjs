/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
// tslint:disable-next-line:max-line-length
import {Array1D, Array3D, NDArrayMathCPU, NDArrayMathGPU} from 'deeplearn';

import {BenchmarkTest} from './benchmark';
import * as benchmark_util from './benchmark_util';

export class BatchNormalization3DCPUBenchmark implements BenchmarkTest {
  async run(size: number): Promise<number> {
    if (size > 256) {
      return new Promise<number>((resolve, reject) => {
        resolve(-1);
      });
    }
    const math = new NDArrayMathCPU();
    const x = Array3D.randUniform([size, size, size], -1, 1);
    const mean = Array1D.new([0]);
    const variance = Array1D.new([1]);
    const varianceEpsilon = .001;
    const start = performance.now();

    math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, undefined, undefined);

    const end = performance.now();

    return new Promise<number>((resolve, reject) => {
      resolve(end - start);
    });
  }
}

export class BatchNormalization3DGPUBenchmark implements BenchmarkTest {
  async run(size: number) {
    const math = new NDArrayMathGPU();
    const x = Array3D.randUniform([size, size, size], -1, 1);
    const mean = Array1D.new([0]);
    const variance = Array1D.new([1]);
    const varianceEpsilon = .001;

    const benchmark = () => math.batchNormalization3D(
        x, mean, variance, varianceEpsilon, undefined, undefined);

    const time = benchmark_util.warmupAndBenchmarkGPU(math, benchmark);

    x.dispose();
    mean.dispose();
    variance.dispose();
    math.dispose();

    return time;
  }
}
